import { FC, useState } from 'react';
import moment from 'moment';
import { History } from 'history';
import Auth from '../auth/Auth';
import { MemoryDto, UpdateMemoryRequest } from '../types';
import { Button, Dimmer, Divider, Form, Grid, Image, Loader, Modal } from 'semantic-ui-react';
import { Link, useLocation } from 'react-router-dom';
import { updateMemory } from '../api/memory-api';

interface MemoryProps {
  auth: Auth;
  history: History;
}

interface LocationState {
  memoryDto: MemoryDto;
}

enum UpdateStatus {
  NoUpdate,
  Updating,
  Updated
}

export const EditMemory: FC<MemoryProps> = ({ auth, history }) => {
  const location = useLocation<LocationState>();

  const [editedMemory, setEditedMemory] = useState<MemoryDto>(location.state?.memoryDto || null);
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus>(UpdateStatus.NoUpdate);

  const handleOnChange = async (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditedMemory({
      ...editedMemory,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    setUpdateStatus(UpdateStatus.Updating);

    const memoryId = editedMemory.memoryId;
    const updateMomoryReq: UpdateMemoryRequest = {
      name: editedMemory.name,
      memoryDate: moment().format(editedMemory.memoryDate),
      location: editedMemory.location,
      content: editedMemory.content
    };

    try {
      await updateMemory(auth.getIdToken(), memoryId, updateMomoryReq);
    } catch (err) {
      alert('Memory update failed');
    }

    setUpdateStatus(UpdateStatus.Updated);
  };

  const renderUpdateState = () => {
    if (updateStatus === UpdateStatus.Updating) {
      return renderLoading('Updating a new memory...');
    }
    if (updateStatus === UpdateStatus.Updated) {
      return renderSuccessPopup('Update memory successfully! You will back to homepage.');
    }
    return (
      <Button
        content="Update memory"
        color="blue"
        icon="edit"
        labelPosition="left"
        type="submit"
      ></Button>
    );
  };

  const renderLoading = (loadingContent: string) => {
    return (
      <Grid.Row>
        <Dimmer active inverted>
          <Loader indeterminate active>
            {loadingContent}
          </Loader>
        </Dimmer>
      </Grid.Row>
    );
  };

  const renderSuccessPopup = (sucessMessage: string) => {
    return (
      <Modal centered={true} open={updateStatus === UpdateStatus.Updated}>
        <Modal.Header>Success</Modal.Header>
        <Modal.Content>
          <Modal.Description>{sucessMessage}</Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Link to={'/'}>
            <Button>OK</Button>
          </Link>
        </Modal.Actions>
      </Modal>
    );
  };

  return (
    <>
      <h1>Create a new your memory</h1>
      <Image src={editedMemory.attachmentUrl} size="medium" verticalAlign="middle" wrapped />
      <Form onSubmit={handleSubmit}>
        <Form.Group widths="equal">
          <Form.Input
            id="memory-name"
            name="name"
            required={true}
            label="Your memory name"
            defaultValue={editedMemory.name}
            placeholder="The first kiss"
            onChange={handleOnChange}
          />
          <Form.Input
            id="memory-date"
            name="memoryDate"
            type="date"
            label="The memory date"
            defaultValue={moment().format('YYYY-MM-DD')}
            onChange={handleOnChange}
          />
          <Form.Input
            id="memory-location"
            name="location"
            label="Your memory location"
            defaultValue={editedMemory.location}
            placeholder="Union Beach, HCMC"
            onChange={handleOnChange}
          />
        </Form.Group>
        <Form.TextArea
          id="memory-content"
          name="content"
          required={true}
          label="Memory content"
          defaultValue={editedMemory.content}
          placeholder="Minimun 10 characters"
          onChange={handleOnChange}
        />
        <Divider />

        {renderUpdateState()}
      </Form>
    </>
  );
};
