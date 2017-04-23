module Home {
    export class StateHome implements State {

        private homeElementId: string;
        private levelsElementId: string;

        constructor(private levelSummaries: Level.LevelSummary[]) {
            this.homeElementId = 'home';
            this.levelsElementId = 'home-levels';
        }

        start(listener: StateListener): void {
            // populate the levels
            let homeElement = document.getElementById(this.homeElementId);
            homeElement.removeAttribute('class');

            let levelsElement = document.getElementById(this.levelsElementId);

            while (levelsElement.firstChild != null) {
                levelsElement.removeChild(levelsElement.firstChild);
            }

            // render level descriptions
            for (let levelSummary of this.levelSummaries) {
                let unlocked = localStorage.getItem('level-' + levelSummary.id) || levelSummary.id == 0;
                let element = document.createElement('div');
                let innerHTML = '<div class="home-level-box"><p class="home-level-id">' + (!unlocked ? '<img class="home-level-lock" src="res/lock.png"/>' : (levelSummary.id + 1))  + '</p><p class="home-level-name">' + levelSummary.name + '</p></div>'
                element.innerHTML = innerHTML;
                element.setAttribute('class', 'home-level');
                if (unlocked) {
                    element.onclick = (function (id: number) {
                        return function (event: MouseEvent) {
                            listener(new StateEvent(StateEventType.PlayLevel, new StateEventDataLevelPlay(id)));
                        }
                    })(levelSummary.id);
                }
                levelsElement.appendChild(element);
            }
        }

        stop(): void {
            let homeElement = document.getElementById(this.homeElementId);
            homeElement.setAttribute('class', 'hidden');
        }

    }
}