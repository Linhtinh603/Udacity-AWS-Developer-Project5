import { FC, useEffect, useState } from 'react';
import { History } from 'history';
import Auth from '../auth/Auth';
import { Button, Divider, Grid, Header, Icon, Image, Label, Loader } from 'semantic-ui-react';
import { getMemories, deleteMemory } from '../api/memory-api';
import { MemoryDto } from '../types/memory-dto';

interface MemoryProps {
  auth: Auth;
  history: History;
}

export const Memories: FC<MemoryProps> = ({ auth, history }) => {
  useEffect(() => {
    fechMemoryData();
  }, []);

  const [memories, setMemories] = useState<Array<MemoryDto>>([]);
  const [isLoadingMemories, setIsLoadingMemories] = useState<boolean>(true);

  const fechMemoryData = async () => {
    const memoryData = await getMemories(auth.getIdToken());
    setIsLoadingMemories(false);
    setMemories(memoryData);
  };

  const onEditButtonClick = (memoryId: string) => {
    history.push(`/memories/${memoryId}/edit`);
  };

  const onMemoryDelete = async (memoryId: string) => {
    try {
      await deleteMemory(auth.getIdToken(), memoryId);
      const memoriesAfterDeleted = memories.filter((memory) => {
        return memory.memoryId !== memoryId;
      });
      setMemories(memoriesAfterDeleted);
    } catch {
      alert('Memory deletion failed');
    }
  };

  const renderLoading = () => {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Memory Data
        </Loader>
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
                  src={memory.attachmentUrl}
                  size="large"
                  wrapped
                />
              </Grid.Column>
              <Grid.Column width={12} verticalAlign="middle">
                <Grid>
                  <Grid.Column width={12} verticalAlign="middle">
                    <Label basic color="blue" size="large">
                      {memory.name}
                    </Label>
                  </Grid.Column>
                  <Grid.Column width={2} floated="right">
                    <Button
                      icon
                      color="blue"
                      size="mini"
                      onClick={() => onEditButtonClick(memory.memoryId)}
                    >
                      <Icon name="pencil" />
                    </Button>
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
      <Header as="h1" textAlign='center' block color='orange'>Memory Pictures</Header>
      <Grid.Column width={16} verticalAlign="middle">
        <Button
          icon="add circle"
          color="blue"
          content="Add new memory"
          onClick={() => history.push(`/memories/new`)}
        ></Button>
        <Divider />
      </Grid.Column>

      {isLoadingMemories ? renderLoading() : renderMemoryItems()}
    </div>
  );
};
