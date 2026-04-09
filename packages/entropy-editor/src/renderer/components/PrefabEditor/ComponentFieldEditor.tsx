import { Description, Input, Label, ListBox, NumberField, Select, Switch, TextField } from '@heroui/react';
import type { ReactElement } from 'react';
import type { IComponentFieldDescriptor } from '../../../shared/types/prefab';

interface IVector2 {
  readonly x: number;
  readonly y: number;
}

export interface IComponentFieldEditorProps {
  readonly field: IComponentFieldDescriptor;
  readonly value: unknown;
  readonly onChange: (fieldName: string, value: unknown) => void;
}

function asNumber(value: unknown, fallback: unknown): number {
  if (typeof value === 'number' && !Number.isNaN(value)) return value;
  if (typeof fallback === 'number' && !Number.isNaN(fallback)) return fallback;
  return 0;
}

function asString(value: unknown, fallback: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof fallback === 'string') return fallback;
  return '';
}

function asBoolean(value: unknown, fallback: unknown): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof fallback === 'boolean') return fallback;
  return false;
}

function asVector2(value: unknown, fallback: unknown): IVector2 {
  if (value !== null && typeof value === 'object' && 'x' in value && 'y' in value) {
    return { x: Number((value as IVector2).x), y: Number((value as IVector2).y) };
  }
  if (fallback !== null && typeof fallback === 'object' && 'x' in fallback && 'y' in fallback) {
    return { x: Number((fallback as IVector2).x), y: Number((fallback as IVector2).y) };
  }
  return { x: 0, y: 0 };
}

export function ComponentFieldEditor({ field, value, onChange }: IComponentFieldEditorProps): ReactElement {
  switch (field.type) {
    case 'number':
      return (
        <NumberField
          value={asNumber(value, field.defaultValue)}
          onChange={(v) => onChange(field.name, v)}
          minValue={field.min}
          maxValue={field.max}
          step={field.step}
        >
          <Label>{field.displayName}</Label>
          <NumberField.Group>
            <NumberField.Input />
          </NumberField.Group>
          {field.description !== undefined && <Description>{field.description}</Description>}
        </NumberField>
      );

    case 'string':
      return (
        <TextField onChange={(v) => onChange(field.name, v)}>
          <Label>{field.displayName}</Label>
          <Input value={asString(value, field.defaultValue)} />
          {field.description !== undefined && <Description>{field.description}</Description>}
        </TextField>
      );

    case 'boolean':
      return (
        <Switch
          isSelected={asBoolean(value, field.defaultValue)}
          onChange={(v) => onChange(field.name, v)}
        >
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
          <Switch.Content>
            <Label className="text-sm">{field.displayName}</Label>
          </Switch.Content>
        </Switch>
      );

    case 'vector2': {
      const vec = asVector2(value, field.defaultValue);
      return (
        <div>
          <p className="mb-1 text-sm text-foreground">{field.displayName}</p>
          <div className="grid grid-cols-2 gap-2">
            <NumberField
              value={vec.x}
              onChange={(v) => onChange(field.name, { x: v, y: vec.y })}
              step={field.step}
            >
              <Label>X</Label>
              <NumberField.Group>
                <NumberField.Input />
              </NumberField.Group>
            </NumberField>
            <NumberField
              value={vec.y}
              onChange={(v) => onChange(field.name, { x: vec.x, y: v })}
              step={field.step}
            >
              <Label>Y</Label>
              <NumberField.Group>
                <NumberField.Input />
              </NumberField.Group>
            </NumberField>
          </div>
          {field.description !== undefined && (
            <p className="mt-1 text-xs text-muted">{field.description}</p>
          )}
        </div>
      );
    }

    case 'color': {
      const colorValue = asString(value, field.defaultValue);
      return (
        <div className="flex items-end gap-2">
          <TextField className="flex-1" onChange={(v) => onChange(field.name, v)}>
            <Label>{field.displayName}</Label>
            <Input value={colorValue} />
          </TextField>
          {colorValue !== '' && (
            <div
              className="size-8 shrink-0 rounded border border-border"
              style={{ backgroundColor: colorValue }}
            />
          )}
        </div>
      );
    }

    case 'enum': {
      const enumValues = field.enumValues ?? [];
      const currentValue = asString(value, field.defaultValue);
      return (
        <Select
          value={currentValue}
          onChange={(v) => { if (v !== null) onChange(field.name, String(v)); }}
        >
          <Label>{field.displayName}</Label>
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {enumValues.map((ev) => (
                <ListBox.Item key={ev} id={ev} textValue={ev}>
                  {ev}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>
      );
    }

    case 'asset':
      return (
        <TextField onChange={(v) => onChange(field.name, v)}>
          <Label>{field.displayName}</Label>
          <Input
            value={asString(value, field.defaultValue)}
            placeholder="File path..."
          />
          {field.description !== undefined && <Description>{field.description}</Description>}
        </TextField>
      );
  }
}
