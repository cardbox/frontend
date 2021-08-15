import * as React from 'react';
import styled from 'styled-components';
import { Answer, Question } from '@box/api';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { paths } from '@box/pages/paths';
import { theme } from '@box/lib/theme';

export const Comments = () => (
  <>
    <Helmet title="Card comments" />
    <Container>
      <Title>
        Questions <span>3</span>
      </Title>
      <List>
        <Question
          topic="How to use it with redux?"
          author={{ id: '1', username: 'LangCreator' }}
          when="today"
          resolved
          text={
            <>
              I'm afraid this is a very simple question. It might be too easy to
              be asked here, but I can't figure this out on my own and I just
              want to know. It is about oDataModel and the methods "create" and
              "update". In Demo Kit I find the interface as follows:
            </>
          }
          responses={{
            count: 3,
            lastResponseAt: 'Last response 8 hours ago',
            authors: ['5', '1', '4'],
          }}
        >
          <Answer
            author={{ id: '4', username: 'LangCreator' }}
            when="11 hours ago"
            title="Artur Bon"
            text={
              <>
                <Mention>@Esprit</Mention> positif So what are the issues,
                challenges- potential for improvement? You’ve been through he
                strengths. Where does it fall short in comparison to other
                tools? I apologise for sounding a bit crude, but this post read
                like a sales pitch, not a designer’s review.
              </>
            }
            why="liked"
          />
        </Question>
        <Question
          topic="What version of Effector supports it?"
          author={{ id: '2', username: 'LangCreator' }}
          when="3 days ago"
          text={
            <>
              It doesn't seem to be very clear for me, it is suppose to ask for
              permission to the user but I keep getting the error "Error:
              NotAllowedError: Permission denied by system". Is it a feature
              that is on testing
            </>
          }
          responses={{
            count: 6,
            lastResponseAt: 'Last response 2 days ago',
            authors: ['9', '2'],
          }}
        />
        <Question
          topic="What about to add native support for Set in Effector core?"
          author={{ id: '3', username: 'LangCreator' }}
          when="week ago"
          text={
            <>
              ID's are unique for each element and same ID cannot be used on
              multiple elements. If you really want to do operations using a
              single block of code to different elements, try using classes
            </>
          }
          responses={{
            count: 0,
            lastResponseAt: '',
            authors: [],
          }}
        />
      </List>
    </Container>
  </>
);

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  font-weight: 500;
  font-size: 24px;
  line-height: 30px;

  & > span {
    color: var(${theme.palette.bnw600});
  }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 12px;
  margin-bottom: 24px;

  & > * + * {
    margin-top: 12px;
  }
`;

const Question: React.FC<Question> = ({
  topic,
  author,
  when,
  text,
  resolved,
  responses,
  children,
}) => (
  <QuestionContainer>
    <Heading>
      <UserLink to={paths.user(author.username)}>
        <AuthorImage src={`https://i.pravatar.cc/72?u=${author.id}`} />
      </UserLink>
      <Topic>{topic}</Topic>
      <When>{when}</When>
      {resolved && (
        <ResolvedChip data-kind="primary">Question is resolved</ResolvedChip>
      )}
    </Heading>
    <Content>
      <Text>{text}</Text>
      <ResponsesButton>
        {responses.authors.slice(0, 3).map((id) => (
          <AuthorImage key={id} src={`https://i.pravatar.cc/48?u=${id}`} />
        ))}
        <span data-kind="primary">{responses.count} responses</span>
        <span>
          {responses.count ? responses.lastResponseAt : 'Write response'}
        </span>
      </ResponsesButton>
      {children}
    </Content>
  </QuestionContainer>
);

const Answer: React.FC<Answer> = ({ author, when, title, text, why }) => (
  <AnswerContainer>
    <Heading>
      <AuthorImage src={`https://i.pravatar.cc/72?u=${author.id}`} />
      <Topic>{title}</Topic>
      <When>{when}</When>
      {why === 'liked' ? (
        <ResolvedChip>The most liked answer</ResolvedChip>
      ) : null}
    </Heading>
    <Content>
      <Text>{text}</Text>
    </Content>
  </AnswerContainer>
);

const AnswerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 10px;
  border-radius: 6px;
  margin-top: 12px;
`;

const Heading = styled.div`
  display: flex;
  height: 36px;
  flex-wrap: nowrap;
  align-items: center;

  & > *:not(:first-child) {
    margin-left: 12px;
  }
`;

const Topic = styled.h5`
  font-weight: 500;
  font-size: 18px;
  line-height: 36px;
  color: var(${theme.palette.bnw0});
  margin: 0;
`;

const AuthorImage = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
`;

const When = styled.div`
  font-size: 15px;
  line-height: 36px;
  color: var(${theme.palette.bnw600});
`;

const Content = styled.div`
  margin-left: 48px;
  display: flex;
  flex-direction: column;
`;

const Text = styled.div`
  font-size: 15px;
  line-height: 21px;
  color: var(${theme.palette.bnw200});
`;

const ResponsesButton = styled.div`
  display: flex;
  background-color: white;
  border: 1px solid transparent;
  box-sizing: border-box;
  padding: 6px;
  line-height: 24px;
  height: 38px;
  border-radius: 6px;
  align-items: center;
  cursor: pointer;
  margin-top: 12px;

  & ${AuthorImage} {
    width: 24px;
    height: 24px;
    margin: 0;
    padding: 0;
    line-height: 24px;

    &:not(:first-child) {
      margin-left: -9px;
      box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.8);
    }
  }

  & span {
    display: inline-block;
    font-size: 15px;
    line-height: 24px;
    color: var(${theme.palette.bnw600});
    margin-left: 9px;

    &[data-kind='primary'] {
      color: var(${theme.palette.unknown3});
    }
  }
`;

const QuestionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 10px;
  border-radius: 6px;

  &:hover {
    background-color: var(${theme.palette.bnw900});

    & ${ResponsesButton} {
      border-color: var(${theme.palette.bnw850});
    }
  }
`;

const Mention = styled.span`
  color: var(${theme.palette.unknown3});
`;

const ResolvedChip = styled.div`
  height: 22px;
  border-radius: 12px;
  font-size: 12px;
  line-height: 22px;
  padding: 0 9px;
  color: var(${theme.palette.bnw600});
  background-color: var(${theme.palette.bnw900});

  &[data-kind='primary'] {
    color: white;
    background-color: var(${theme.palette.unknown2});
  }
`;

const UserLink = styled(Link)``;
