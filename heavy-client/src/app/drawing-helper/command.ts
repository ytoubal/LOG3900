export interface ICommand {
    execute(board: Node[]): void;
    cancel(board: Node[]): void;
}
