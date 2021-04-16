export abstract class DndDirectiveBase {

  constructor() { }

  public abstract onDragOver(evt: DragEvent): void;

  public abstract onDragLeave(evt: DragEvent): void;

  public abstract onDrop(evt: DragEvent): void;
}
