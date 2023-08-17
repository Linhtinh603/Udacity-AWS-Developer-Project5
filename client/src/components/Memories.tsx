import { FC, useEffect, useState } from 'react';
import { History } from 'history';
import Auth from '../auth/Auth';
import { Button, Dimmer, Divider, Grid, Icon, Image, Label, Loader } from 'semantic-ui-react';
import { getMemories, deleteMemory } from '../api/memory-api';
import { MemoryDto } from '../types/memory-dto';
import { Link } from 'react-router-dom';

interface MemoryProps {
  auth: Auth;
  history: History;
}

export const Memories: FC<MemoryProps> = ({ auth, history }) => {
  useEffect(() => {
    const fechMemoryData = async () => {
      const memoryData = await getMemories(auth.getIdToken());
      setIsLoadingMemories(false);
      setMemories(memoryData);
    };

    fechMemoryData();
  }, []);

  const [memories, setMemories] = useState<Array<MemoryDto>>([]);
  const [isLoadingMemories, setIsLoadingMemories] = useState<boolean>(true);
  const [isDeletingMemory, setIsDeletingMemory] = useState<boolean>(false);

  const onEditButtonClick = (memoryId: string) => {
    history.push(`/memories/${memoryId}/edit`);
  };

  const onMemoryDelete = async (memoryId: string) => {
    setIsDeletingMemory(true);
    try {
      await deleteMemory(auth.getIdToken(), memoryId);
      const memoriesAfterDeleted = memories.filter((memory) => {
        return memory.memoryId !== memoryId;
      });
      setIsDeletingMemory(false);
      setMemories(memoriesAfterDeleted);
    } catch {
      alert('Memory deletion failed');
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

  const renderMemoryItems = () => {
    return (
      <Grid padded>
        {memories.map((memory) => {
          return (
            <Grid.Row key={memory.memoryId}>
              <Grid.Column width={4} verticalAlign="middle">
                <Image
                  label={{
                    as: 'a',
                    color: 'grey',
                    content: memory.memoryDate,
                    icon: 'time',
                    ribbon: true
                  }}
                  src={memory.thumbnailAttachmentUrl}
                  size="large"
                  wrapped
                />
              </Grid.Column>
              <Grid.Column width={12} verticalAlign="middle">
                <Grid>
                  <Grid.Column width={12} verticalAlign="middle">
                    <Label basic color="blue" size="large">
                      {memory.name}
                      <Label.Detail>at {memory.location}</Label.Detail>
                    </Label>
                  </Grid.Column>
                  <Grid.Column width={2} floated="right">
                    <Link
                      to={{
                        pathname: `/memories/${memory.memoryId}/edit`,
                        state: { memoryDto: memory }
                      }}
                    >
                      <Button
                        icon
                        color="blue"
                        size="mini"
                        onClick={() => onEditButtonClick(memory.memoryId)}
                      >
                        <Icon name="pencil" />
                      </Button>
                    </Link>
                  </Grid.Column>
                  <Grid.Column width={2} floated="right">
                    <Button
                      icon
                      color="red"
                      size="mini"
                      onClick={() => onMemoryDelete(memory.memoryId)}
                    >
                      <Icon name="delete" />
                    </Button>
                  </Grid.Column>
                </Grid>
                <Grid.Column width={16}>
                  <Divider />
                </Grid.Column>
                <Grid.Column width={16}>{memory.content}</Grid.Column>
              </Grid.Column>

              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          );
        })}
      </Grid>
    );
  };

  return (
    <div>
      <Grid.Column width={16} verticalAlign="middle">
        <Button
          icon="add circle"
          color="blue"
          content="Add new memory"
          onClick={() => history.push(`/memories/new`)}
        ></Button>
        <Divider />
      </Grid.Column>
      {isLoadingMemories && renderLoading('Loading memory data...')}
      {isDeletingMemory && renderLoading('Deleting memory data...')}
      {!isLoadingMemories && !isDeletingMemory && renderMemoryItems()}
    </div>
  );
};
