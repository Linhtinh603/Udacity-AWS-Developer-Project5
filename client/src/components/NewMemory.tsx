import { FC, useState } from 'react';
import { History } from 'history';
import { Button, Divider, Form, Grid, Input, Loader, Message, TextArea } from 'semantic-ui-react';
import { createMemory, getUploadUrl, uploadFile } from '../api/memory-api';
import Auth from '../auth/Auth';
import { CreateMemoryRequest } from '../types';

enum UploadStatus {
  NoUpload,
  InitItem,
  FetchingPresignedUrl,
  UploadingFile
}

interface MemoryProps {
  auth: Auth;
  history: History;
}

export const NewMemory: FC<MemoryProps> = ({ auth, history }) => {
  const [picture, setPicture] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>(UploadStatus.NoUpload);

  const handlePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setPicture(files[0]);
  };

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    try {
      if (!picture) {
        alert('Picture should be selected');
        return;
      }
      setUploadStatus(UploadStatus.InitItem);

      const newMemoryReq: CreateMemoryRequest = {
        name: 'Test Memory',
        memoryDate: new Date().toLocaleDateString(),
        location: 'HCMC, Vietnam',
        content: 'I miss this location, this view, this feeling...'
      };
      const result = await createMemory(auth.getIdToken(), newMemoryReq);

      setUploadStatus(UploadStatus.FetchingPresignedUrl);

      const uploadUrl = await getUploadUrl(auth.getIdToken(), result.memoryId);

      setUploadStatus(UploadStatus.UploadingFile);

      await uploadFile(uploadUrl, picture);
    } catch (e) {
      alert('Could not upload a file: ' + (e as Error).message);
    } finally {
      setUploadStatus(UploadStatus.NoUpload);
    }
  };

  const renderLoading = (loadingContent: string) => {
    return (
      <Grid.Row>
        <Loader indeterminate active>
          {loadingContent}
        </Loader>
      </Grid.Row>
    );
  };

  const renderUploadButton = () => {
    return (
      <div>
        {uploadStatus === UploadStatus.InitItem && renderLoading('Creating a new memory...')}
        {uploadStatus === UploadStatus.FetchingPresignedUrl &&
          renderLoading('Fetching presigned Url...')}
        {uploadStatus === UploadStatus.UploadingFile &&
          renderLoading('Uploading your memory picture...')}

        <Button
          content="New memory"
          color="blue"
          icon="add"
          labelPosition="left"
          loading={uploadStatus !== UploadStatus.NoUpload}
          disabled={uploadStatus !== UploadStatus.NoUpload}
          type="submit"
        ></Button>
      </div>
    );
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
              required={true}
              control={Input}
              label="Your memory name"
              placeholder="The first kiss"
            />
            <Form.Field id="memory-date" control={Input} type="date" label="The memory date" />
            <Form.Field
              id="memory-name"
              control={Input}
              label="Your memory location"
              placeholder="Union Beach, HCMC"
            />
          </Form.Group>
          <Form.Field
            id="memory-content"
            required={true}
            control={TextArea}
            label="Memory content"
            placeholder="Minimun 10 characters"
          />
          <Divider />

          {renderUploadButton()}
        </Form>
      </div>
    </>
  );
};
