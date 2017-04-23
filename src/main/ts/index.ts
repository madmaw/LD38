window.onload = function () {


    let colors = ['#fff', '#ff0', '#f0f', '#f00', '#0ff', '#0f0', '#00f'];
    let stateLoading = new Loading.StateLoading({
        'player': 'res/player_mask.png',
        'wall-horizontal': 'res/wall-horizontal.png',
        'wall-vertical': 'res/wall-vertical.png',
        'dragon': 'res/dragon.png',
        'boulder': 'res/boulder.png', 
        'tile': 'res/tile.png',
        'tile-active': 'res/tile_complete.png'
    }, Color.VALUES);

    let currentState: State = null;
    let stateFactory: StateFactory;

    let eventHandler = function (event: StateEvent) {
        let state: State;
        if (event.type == StateEventType.LoadingComplete && (event.data instanceof StateEventDataLoadingComplete)) {
            let loadingResult = event.data;
            // create some factories
            let stateFactories: { [_: string]: StateFactory } = {};
            let roomFactories: Level.Description.DelegatableRoomFactory[] = [
            ];
            let levelId = 0;
            let done = false;
            while (!done) {
                let id = 'level-' + (levelId + 1);
                let element = document.getElementById(id);
                if (element != null) {
                    let helpText = element.getAttribute('help');
                    roomFactories.push(new Level.Description.DelegatableRoomFactory(
                        new Level.LevelSummary(levelId, element.getAttribute('name')),
                        new Level.Description.TemplateRoomFactory(element.innerText, helpText).create()
                    ));
                    levelId++;
                } else {
                    done = true;
                }
            }

            var audioContext: AudioContext;
            let splitSound: Sound.Sound;
            let moveSound: Sound.Sound;
            if ((<any>window)["AudioContext"] != null) {
                audioContext = new AudioContext();
                //    } else if (_w["webkitAudioContext"]) {
                //        audioContext = new webkitAudioContext();
                splitSound = new Sound.WebAudioBoomSoundFactory(audioContext, 0.2).create();
                moveSound = new Sound.WebAudioToneSoundFactory(audioContext, 'sawtooth', 250, 1000, 400, 0.01, 0.08, 0.12, 0.3, 0.3).create();
            } else {
                splitSound = function () {

                };
                moveSound = splitSound;
            }
            var sounds: { [_: string]: Sound.Sound } = {};
            sounds['split'] = splitSound;
            sounds['move'] = moveSound;

            let roomFactory = new Level.Description.DelegatingRoomFactory(roomFactories);
            stateFactories[StateKeyType.Home] = (new Home.StateFactoryHome(roomFactory.getLevelSummaries())).create();
            stateFactories[StateKeyType.LevelPlay] = (new Level.StateFactoryLevel(
                loadingResult.images,
                sounds, 
                roomFactory.create())
            ).create();

            stateFactory = new DelegatingStateFactory(stateFactories).create();
            state = stateFactory(new StateKey(StateKeyType.Home));
        } else if (event.type == StateEventType.PlayLevel && (event.data instanceof StateEventDataLevelPlay)) {
            // unlock that level
            localStorage.setItem("level-"+event.data.id, ""+true);
            state = stateFactory(new StateKey(StateKeyType.LevelPlay, new StateKeyDataLevelPlay(event.data.id)));
        } else if (event.type == StateEventType.GoHome) {
            state = stateFactory(new StateKey(StateKeyType.Home));
        } else {
            state = null;
        }
        if (state != null) {
            setState(state);
        }
    }

    let setState = function (state: State) {
        if (currentState != null) {
            currentState.stop();
        }
        currentState = state;
        if (state != null) {
            state.start(eventHandler);
        }
    }

    setState(stateLoading);

}
