import { FC, useState } from 'react';
import { History } from 'history';
import {
  Button,
  Dimmer,
  Divider,
  Form,
  Grid,
  Input,
  Loader,
  Modal,
  TextArea
} from 'semantic-ui-react';
import { createMemory, getUploadUrl, uploadFile } from '../api/memory-api';
import Auth from '../auth/Auth';
import { CreateMemoryRequest } from '../types';
import { Link } from 'react-router-dom';

enum CreateStatus {
  NoUpload,
  InitItem,
  FetchingPresignedUrl,
  UploadingFile,
  Created
}

interface MemoryProps {
  auth: Auth;
  history: History;
}

export const NewMemory: FC<MemoryProps> = ({ auth, history }) => {
  const [picture, setPicture] = useState<File | null>(null);
  const [createStatus, setCreateStatus] = useState<CreateStatus>(CreateStatus.NoUpload);
  const [newMemory, setNewMemory] = useState<CreateMemoryRequest>({
    name: '',
    content: '',
    location: '',
    memoryDate: ''
  });

  const handlePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setPicture(files[0]);
  };

  const handleDataChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setNewMemory({
      ...newMemory,
      [name]: value
    });
  };

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    try {
      if (!picture) {
        alert('Picture should be selected');
        return;
      }
      setCreateStatus(CreateStatus.InitItem);

      const newMemoryReq: CreateMemoryRequest = {
        name: newMemory.name,
        memoryDate: newMemory.memoryDate,
        location: newMemory.location,
        content: newMemory.content
      };
      const result = await createMemory(auth.getIdToken(), newMemoryReq);

      setCreateStatus(CreateStatus.FetchingPresignedUrl);

      const uploadUrl = await getUploadUrl(auth.getIdToken(), result.memoryId);

      setCreateStatus(CreateStatus.UploadingFile);

      await uploadFile(uploadUrl, picture);

      setCreateStatus(CreateStatus.Created);
    } catch (e) {
      alert('Could not upload a file: ' + (e as Error).message);
      setCreateStatus(CreateStatus.NoUpload);
    }
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
      <Modal centered={true} open={createStatus === CreateStatus.Created}>
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

  const renderCreateState = () => {
    switch (createStatus) {
      case CreateStatus.InitItem:
        return renderLoading('Creating a new memory...');
      case CreateStatus.FetchingPresignedUrl:
        return renderLoading('Fetching presigned Url...');
      case CreateStatus.UploadingFile:
        return renderLoading('Uploading your memory picture...');
      case CreateStatus.Created:
        return renderSuccessPopup('Create memory successfully! You will back to homepage.');
      default:
        return (
          <Button
            content="New memory"
            color="blue"
            icon="add"
            labelPosition="left"
            loading={createStatus !== CreateStatus.NoUpload}
            disabled={createStatus !== CreateStatus.NoUpload}
            type="submit"
          ></Button>
        );
    }
  };

  return (
    <>
      <div>
        <h1>Create a new your memory</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Field required={true}>
            <label>Your memory picture</label>
            <input
              type="file"
              accept="image/*"
              placeholder="Image to upload"
              onChange={handlePictureChange}
            />
          </Form.Field>

          <Form.Group widths="equal">
            <Form.Field
              id="memory-name"
              name="name"
              required={true}
              control={Input}
              label="Your memory name"
              placeholder="The first kiss"
              value={newMemory.name}
              onChange={handleDataChange}
            />
            <Form.Field
              id="memory-date"
              name="memoryDate"
              control={Input}
              type="date"
              label="The memory date"
              value={newMemory.memoryDate}
              onChange={handleDataChange}
            />
            <Form.Field
              id="memory-location"
              name="location"
              control={Input}
              label="Your memory location"
              placeholder="Union Beach, HCMC"
              value={newMemory.location}
              onChange={handleDataChange}
            />
          </Form.Group>
          <Form.Field
            id="memory-content"
            name="content"
            required={true}
            control={TextArea}
            label="Memory content"
            placeholder="Minimun 10 characters"
            value={newMemory.content}
            onChange={handleDataChange}
          />
          <Divider />

          {renderCreateState()}
        </Form>
      </div>
    </>
  );
};
