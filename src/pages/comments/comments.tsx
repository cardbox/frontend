import * as React from 'react';
import styled from 'styled-components';

export const Comments = () => (
  <Container>
    <Title>
      Questions <span>3</span>
    </Title>
    <List>
      <Question
        topic="How to use it with redux?"
        author={{ id: '1' }}
        when="today"
        resolved
        text={
          <>
            I'm afraid this is a very simple question. It might be too easy to be asked here, but I
            can't figure this out on my own and I just want to know. It is about oDataModel and the
            methods "create" and "update". In Demo Kit I find the interface as follows:
          </>
        }
        responses={{
          count: 3,
          lastReponseAt: 'Last response 8 hours ago',
          authors: ['5', '1', '4'],
        }}
      >
        <Answer
          author={{ id: '4' }}
          when="11 hours ago"
          title="Artur Bon"
          text={
            <>
              <Mention>@Esprit</Mention> positif So what are the issues, challenges — potential for
              improvement? You’ve been through he strengths. Where does it fall short in comparison
              to other tools? I apologise for sounding a bit crude, but this post read like a sales
              pitch, not a designer’s review.
            </>
          }
          why="liked"
        />
      </Question>
      <Question
        topic="What version of Effector supports it?"
        author={{ id: '2' }}
        when="3 days ago"
        text={
          <>
            It doesn't seem to be very clear for me, it is suppose to ask for permission to the user
            but I keep getting the error "Error: NotAllowedError: Permission denied by system". Is
            it a feature that is on testing
          </>
        }
        responses={{
          count: 6,
          lastReponseAt: 'Last response 2 days ago',
          authors: ['9', '2'],
        }}
      />
      <Question
        topic="What about to add native support for Set in Effector core?"
        author={{ id: '3' }}
        when="week ago"
        text={
          <>
            ID's are unique for each element and same ID cannot be used on multiple elements. If you
            really want to do operations using a single block of code to different elements, try
            using classes
          </>
        }
        responses={{
          count: 0,
          lastReponseAt: '',
          authors: [],
        }}
      />
    </List>
  </Container>
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
    color: #a39bb2;
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

interface Question {
  topic: string;
  author: { id: string };
  when: string;
  text: React.ReactNode;
  resolved?: boolean;
  responses: {
    authors: string[];
    count: number;
    lastReponseAt: string;
  };
}

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
      <AuthorImage src={`https://i.pravatar.cc/72?u=${author.id}`} />
      <Topic>{topic}</Topic>
      <When>{when}</When>
      {resolved ? <ResolvedChip data-kind="primary">Question is resolved</ResolvedChip> : null}
    </Heading>
    <Content>
      <Text>{text}</Text>
      <ResponsesButton>
        {responses.authors.slice(0, 3).map((id) => (
          <AuthorImage key={id} src={`https://i.pravatar.cc/48?u=${id}`} />
        ))}
        <span data-kind="primary">{responses.count} responses</span>
        <span>{responses.count ? responses.lastReponseAt : 'Write response'}</span>
      </ResponsesButton>
      {children}
    </Content>
  </QuestionContainer>
);

interface Answer {
  author: { id: string };
  title: string;
  when: string;
  why: 'liked' | false;
  text: React.ReactNode;
}

const Answer: React.FC<Answer> = ({ author, when, title, text, why }) => (
  <AnswerContainer>
    <Heading>
      <AuthorImage src={`https://i.pravatar.cc/72?u=${author.id}`} />
      <Topic>{title}</Topic>
      <When>{when}</When>
      {why === 'liked' ? <ResolvedChip>The most liked answer</ResolvedChip> : null}
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
  color: #000000;
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
  color: #a39bb2;
`;

const Content = styled.div`
  margin-left: 48px;
  display: flex;
  flex-direction: column;
`;

const Text = styled.div`
  font-size: 15px;
  line-height: 21px;
  color: #1a1e23;
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
    color: #a39bb2;
    margin-left: 9px;

    &[data-kind='primary'] {
      color: #007bff;
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
    background-color: #f7f6f9;

    & ${ResponsesButton} {
      border-color: #e7e5ee;
    }
  }
`;

const Mention = styled.span`
  color: #007bff;
`;

const ResolvedChip = styled.div`
  height: 22px;
  border-radius: 12px;
  font-size: 12px;
  line-height: 22px;
  padding: 0 9px;
  color: #a39bb2;
  background-color: #f7f6f9;

  &[data-kind='primary'] {
    color: white;
    background-color: #683aef;
  }
`;
