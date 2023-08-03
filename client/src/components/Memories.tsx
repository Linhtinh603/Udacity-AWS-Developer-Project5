import { FC, useEffect, useState } from 'react';
import { History } from 'history';
import Auth from '../auth/Auth';
import { Button, Divider, Grid, Header, Icon, Image, Loader } from 'semantic-ui-react';
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
    setMemories(memoryData);
    setIsLoadingMemories(false);
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
    <Grid padded>
      {memories.map((memory) => {
        return (
          <Grid.Row key={memory.memoryId}>
            <Grid.Column width={4} verticalAlign="middle">
              {memory.attachmentUrl && (
                <Image
                  label={{
                    as: 'Memory Time',
                    content: memory.memoryDate,
                    corner: 'left',
                    icon: 'clock outline'
                  }}
                  src={memory.attachmentUrl}
                  size="medium"
                  wrapped
                />
              )}
            </Grid.Column>
            <Grid.Column width={12} verticalAlign="middle">
              <Grid.Column width={12} verticalAlign="middle">
                {memory.name}
              </Grid.Column>
              <Grid.Column width={2} floated="right">
                <Button icon color="blue" onClick={() => onEditButtonClick(memory.memoryId)}>
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={2} floated="right">
                <Button icon color="red" onClick={() => onMemoryDelete(memory.memoryId)}>
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
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
    </Grid>;
  };

  return (
    <div>
      <Header as="h1">Memory Pictures</Header>
      {isLoadingMemories ? renderLoading() : renderMemoryItems()}
    </div>
  );
};
