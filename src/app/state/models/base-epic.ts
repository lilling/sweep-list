export class BaseEpic {
    getEpics = () =>
        (this['epics'] || []).map(epic => epic.bind(this));
}
