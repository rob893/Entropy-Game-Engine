import type { ISerializedComponent } from '@entropy-engine/entropy-game-engine';
import {
  Button,
  Dropdown,
  Header,
  Input,
  Label,
  Modal,
  NumberField,
  Separator,
  TextField
} from '@heroui/react';
import { Minus, Plus, Save } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { ReactElement } from 'react';
import { COMPONENT_SCHEMAS } from '../../../shared/schemas/component-schemas';
import type { IComponentFieldDescriptor, IComponentSchema, IEditorPrefab } from '../../../shared/types/prefab';
import { ComponentFieldEditor } from './ComponentFieldEditor';

export interface IPrefabEditorProps {
  readonly prefab: IEditorPrefab | null;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSave: (prefab: IEditorPrefab) => void;
}

function getDefaultComponentData(schema: IComponentSchema): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  for (const field of schema.fields) {
    data[field.name] = structuredClone(field.defaultValue);
  }
  return data;
}

function getDisplayName(typeName: string): string {
  return COMPONENT_SCHEMAS.get(typeName)?.displayName ?? typeName;
}

export function PrefabEditor({ prefab, isOpen, onClose, onSave }: IPrefabEditorProps): ReactElement | null {
  if (!isOpen) return null;

  return <PrefabEditorContent key={prefab?.id ?? 'new'} prefab={prefab} onClose={onClose} onSave={onSave} />;
}

function createDefaultComponents(): ISerializedComponent[] {
  const transformSchema = COMPONENT_SCHEMAS.get('Transform');
  return [{
    typeName: 'Transform',
    data: transformSchema !== undefined ? getDefaultComponentData(transformSchema) : {}
  }];
}

function PrefabEditorContent({ prefab, onClose, onSave }: Omit<IPrefabEditorProps, 'isOpen'>): ReactElement {
  const [name, setName] = useState(prefab?.name ?? 'New Prefab');
  const [tag, setTag] = useState(prefab?.template.tag ?? 'Untagged');
  const [layer, setLayer] = useState(prefab?.template.layer ?? 0);
  const [category, setCategory] = useState(prefab?.category ?? 'Uncategorized');
  const [components, setComponents] = useState<ISerializedComponent[]>(
    () => prefab !== null ? structuredClone(prefab.template.components) : createDefaultComponents()
  );
  const [selectedComponentIndex, setSelectedComponentIndex] = useState(0);

  const handleOpenChange = (open: boolean): void => {
    if (!open) {
      onClose();
    }
  };

  const handleAddComponent = (typeName: string): void => {
    const schema = COMPONENT_SCHEMAS.get(typeName);
    if (schema === undefined) return;

    const newComponent: ISerializedComponent = {
      typeName: schema.typeName,
      data: getDefaultComponentData(schema)
    };

    const updated = [...components, newComponent];
    setComponents(updated);
    setSelectedComponentIndex(updated.length - 1);
  };

  const handleRemoveComponent = (): void => {
    const comp = components[selectedComponentIndex];
    if (comp === undefined || comp.typeName === 'Transform') return;

    const updated = components.filter((_, i) => i !== selectedComponentIndex);
    setComponents(updated);
    setSelectedComponentIndex(Math.max(0, Math.min(selectedComponentIndex, updated.length - 1)));
  };

  const handleFieldChange = (fieldName: string, value: unknown): void => {
    setComponents(prev => {
      const updated = structuredClone(prev);
      if (selectedComponentIndex >= 0 && selectedComponentIndex < updated.length) {
        updated[selectedComponentIndex].data[fieldName] = value;
      }
      return updated;
    });
  };

  const handleSave = (): void => {
    const result: IEditorPrefab = {
      id: prefab?.id ?? crypto.randomUUID(),
      name,
      category,
      thumbnail: prefab?.thumbnail,
      template: {
        id: prefab?.template.id ?? crypto.randomUUID(),
        name,
        tag,
        layer,
        enabled: true,
        components: structuredClone(components),
        children: prefab?.template.children ?? []
      }
    };

    onSave(result);
  };

  // Available components for the "Add" dropdown (exclude Transform and already-attached)
  const availableComponents = useMemo(() => {
    const attached = new Set(components.map(c => c.typeName));
    return Array.from(COMPONENT_SCHEMAS.values())
      .filter(s => s.typeName !== 'Transform' && !attached.has(s.typeName));
  }, [components]);

  // Group available components by category
  const groupedAvailable = useMemo(() => {
    const groups = new Map<string, IComponentSchema[]>();
    for (const schema of availableComponents) {
      const existing = groups.get(schema.category) ?? [];
      existing.push(schema);
      groups.set(schema.category, existing);
    }
    return groups;
  }, [availableComponents]);

  // Selected component and its schema
  const selectedComponent = components[selectedComponentIndex] ?? null;
  const selectedSchema = selectedComponent !== null
    ? COMPONENT_SCHEMAS.get(selectedComponent.typeName) ?? null
    : null;

  // Group fields by their group property
  const { ungroupedFields, fieldGroups } = useMemo((): {
    ungroupedFields: IComponentFieldDescriptor[];
    fieldGroups: Map<string, IComponentFieldDescriptor[]>;
  } => {
    if (selectedSchema === null) {
      return { ungroupedFields: [], fieldGroups: new Map() };
    }

    const ungrouped: IComponentFieldDescriptor[] = [];
    const groups = new Map<string, IComponentFieldDescriptor[]>();

    for (const field of selectedSchema.fields) {
      if (field.group !== undefined) {
        const existing = groups.get(field.group) ?? [];
        existing.push(field);
        groups.set(field.group, existing);
      } else {
        ungrouped.push(field);
      }
    }

    return { ungroupedFields: ungrouped, fieldGroups: groups };
  }, [selectedSchema]);

  const canRemove = selectedComponent !== null && selectedComponent.typeName !== 'Transform';

  return (
    <Modal isOpen={true} onOpenChange={handleOpenChange}>
      <Modal.Backdrop>
        <Modal.Container size="lg">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>
                {prefab !== null ? `Prefab Editor: "${name}"` : 'New Prefab'}
              </Modal.Heading>
            </Modal.Header>

            <Modal.Body className="p-0">
              <div className="flex min-h-[400px]">
                {/* Left Panel: Settings + Components */}
                <div className="w-1/3 space-y-4 overflow-y-auto border-r border-border p-4">
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-foreground">Prefab Settings</p>

                    <TextField onChange={setName}>
                      <Label>Name</Label>
                      <Input value={name} variant="secondary" />
                    </TextField>

                    <TextField onChange={setTag}>
                      <Label>Tag</Label>
                      <Input value={tag} variant="secondary" />
                    </TextField>

                    <NumberField value={layer} onChange={setLayer} minValue={0}>
                      <Label>Layer</Label>
                      <NumberField.Group>
                        <NumberField.Input />
                      </NumberField.Group>
                    </NumberField>

                    <TextField onChange={setCategory}>
                      <Label>Category</Label>
                      <Input value={category} variant="secondary" />
                    </TextField>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Components</p>

                    <div className="space-y-1">
                      {components.map((comp, index) => (
                        <Button
                          key={`${comp.typeName}-${index}`}
                          variant={selectedComponentIndex === index ? 'primary' : 'ghost'}
                          size="sm"
                          className="w-full justify-start"
                          onPress={() => setSelectedComponentIndex(index)}
                        >
                          {getDisplayName(comp.typeName)}
                        </Button>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Dropdown>
                        <Button
                          size="sm"
                          variant="secondary"
                          isDisabled={availableComponents.length === 0}
                        >
                          <Plus className="size-4" />
                          Add
                        </Button>
                        <Dropdown.Popover>
                          <Dropdown.Menu onAction={(key) => handleAddComponent(String(key))}>
                            {Array.from(groupedAvailable.entries()).map(([cat, schemas]) => (
                              <Dropdown.Section key={cat}>
                                <Header>{cat}</Header>
                                {schemas.map(s => (
                                  <Dropdown.Item key={s.typeName} id={s.typeName} textValue={s.displayName}>
                                    <Label>{s.displayName}</Label>
                                  </Dropdown.Item>
                                ))}
                              </Dropdown.Section>
                            ))}
                          </Dropdown.Menu>
                        </Dropdown.Popover>
                      </Dropdown>

                      <Button
                        size="sm"
                        variant="secondary"
                        isDisabled={!canRemove}
                        onPress={handleRemoveComponent}
                      >
                        <Minus className="size-4" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Right Panel: Component Inspector */}
                <div className="flex-1 space-y-4 overflow-y-auto p-4">
                  {selectedSchema !== null && selectedComponent !== null ? (
                    <>
                      <p className="text-sm font-medium text-foreground">
                        {selectedSchema.displayName}
                      </p>

                      {ungroupedFields.length === 0 && fieldGroups.size === 0 && (
                        <p className="text-sm text-muted">No configurable fields.</p>
                      )}

                      <div className="space-y-3">
                        {ungroupedFields.map(field => (
                          <ComponentFieldEditor
                            key={field.name}
                            field={field}
                            value={selectedComponent.data[field.name]}
                            onChange={handleFieldChange}
                          />
                        ))}
                      </div>

                      {Array.from(fieldGroups.entries()).map(([groupName, fields]) => (
                        <div key={groupName} className="space-y-3">
                          <Separator />
                          <p className="text-xs font-medium text-muted">{groupName}</p>
                          {fields.map(field => (
                            <ComponentFieldEditor
                              key={field.name}
                              field={field}
                              value={selectedComponent.data[field.name]}
                              onChange={handleFieldChange}
                            />
                          ))}
                        </div>
                      ))}
                    </>
                  ) : (
                    <p className="text-sm text-muted">Select a component to edit its properties.</p>
                  )}
                </div>
              </div>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onPress={onClose}>
                Cancel
              </Button>
              <Button variant="primary" onPress={handleSave}>
                <Save className="size-4" />
                Save
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
