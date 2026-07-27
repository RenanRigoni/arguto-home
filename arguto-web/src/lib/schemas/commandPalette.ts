export type CommandResultGroup = "departamento" | "categoria" | "fornecedor" | "produto";

export type CommandResult = {
  group: CommandResultGroup;
  label: string;
  sublabel?: string;
  href: string;
};
