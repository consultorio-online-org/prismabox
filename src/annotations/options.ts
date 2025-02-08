import { getConfig } from "../config";
import { type extractAnnotations, isOptionsVariant } from "./annotations";
import type { DMMF } from '@prisma/generator-helper';

export function generateTypeboxOptions({
  field,
  input,
  exludeAdditionalProperties = false,
}: {
  field?: DMMF.Field,
  input?: ReturnType<typeof extractAnnotations>;
  exludeAdditionalProperties?: boolean;
} = {}): string {
  const stringifiedOptions: string[] = [];
  for (const annotation of input?.annotations ?? []) {
    if (isOptionsVariant(annotation)) {
      stringifiedOptions.push(annotation.value);
    }
  }

  const varCharIdx = field?.nativeType?.findIndex(nt => nt === 'VarChar') ?? 0;
  if (field?.nativeType && varCharIdx > -1 && (varCharIdx + 1) < (field?.nativeType?.length ?? 0)) {
    const [size] = field?.nativeType[varCharIdx + 1];
    if (!Number.isNaN(Number(size))) {
      stringifiedOptions.push(
        `maxLength: ${size}`,
      );
    }
  }

  if (!exludeAdditionalProperties) {
    stringifiedOptions.push(
      `additionalProperties: ${getConfig().additionalProperties}`,
    );
  }

  if (input?.description) {
    stringifiedOptions.push(`description: \`${input.description}\``);
  }

  return stringifiedOptions.length > 0
    ? `{${stringifiedOptions.join(",")}}`
    : "";
}
