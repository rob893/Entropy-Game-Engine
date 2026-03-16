import { Button, Form, Input, Label, Modal, NumberField, TextField } from '@heroui/react';
import { useState } from 'react';
import type { ReactElement, SyntheticEvent } from 'react';

interface INewMapDialogProps {
  onConfirm: (name: string, rows: number, cols: number, tileWidth: number, tileHeight: number) => void;
  onCancel: () => void;
}

export function NewMapDialog({ onConfirm, onCancel }: INewMapDialogProps): ReactElement {
  const [name, setName] = useState('Untitled');
  const [cols, setCols] = useState(30);
  const [rows, setRows] = useState(20);
  const [tileWidth, setTileWidth] = useState(32);
  const [tileHeight, setTileHeight] = useState(32);

  const handleOpenChange = (isOpen: boolean): void => {
    if (!isOpen) {
      onCancel();
    }
  };

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onConfirm(name, rows, cols, tileWidth, tileHeight);
  };

  return (
    <Modal isOpen={true} onOpenChange={handleOpenChange}>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="max-w-[420px]">
            <Form onSubmit={handleSubmit} className="space-y-4">
              <Modal.Header>
                <Modal.Heading>New Map</Modal.Heading>
              </Modal.Header>

              <Modal.Body className="space-y-4">
                <TextField name="name" onChange={setName}>
                  <Label>Name</Label>
                  <Input autoFocus value={name} variant="secondary" />
                </TextField>

                <div className="grid grid-cols-2 gap-3">
                  <NumberField maxValue={500} minValue={1} name="cols" value={cols} onChange={setCols}>
                    <Label>Columns</Label>
                    <NumberField.Group>
                      <NumberField.Input />
                    </NumberField.Group>
                  </NumberField>
                  <NumberField maxValue={500} minValue={1} name="rows" value={rows} onChange={setRows}>
                    <Label>Rows</Label>
                    <NumberField.Group>
                      <NumberField.Input />
                    </NumberField.Group>
                  </NumberField>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <NumberField maxValue={256} minValue={1} name="tileWidth" value={tileWidth} onChange={setTileWidth}>
                    <Label>Tile Width (px)</Label>
                    <NumberField.Group>
                      <NumberField.Input />
                    </NumberField.Group>
                  </NumberField>
                  <NumberField maxValue={256} minValue={1} name="tileHeight" value={tileHeight} onChange={setTileHeight}>
                    <Label>Tile Height (px)</Label>
                    <NumberField.Group>
                      <NumberField.Input />
                    </NumberField.Group>
                  </NumberField>
                </div>
              </Modal.Body>

              <Modal.Footer>
                <Button type="button" variant="secondary" onPress={onCancel}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Create
                </Button>
              </Modal.Footer>
            </Form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
