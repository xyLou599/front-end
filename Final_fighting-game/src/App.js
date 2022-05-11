import { useGame } from './hooks/useGame';
import {
  Link,
  Timer,
  Parag,
  Canvas,
  Result,
  Layout,
  Footer,
  Counter,
  SpanBold,
  Container,
  MiddleSide,
  GlobalStyles,
  LeftSide,
  RightSide,
  Player1Bar,
  Player2Bar,
  Player1Inner,
  Player2Inner,
  TopBarContainer,
  StatusContainer,
  StartOver,
  Overlay,
} from './styles';
import 'twin.macro';

function App() {
  const { canvasRef, player1Health, player2Health, isStarted, timer, result, handleStartButton } = useGame();

  const renderHealthBar = () => (
    <TopBarContainer>
      <StatusContainer>
        <Player1Bar>
          <Player1Inner health={player1Health} />
        </Player1Bar>
        <Timer>
          <Counter>{timer}</Counter>
        </Timer>
        <Player2Bar>
          <Player2Inner health={player2Health} />
        </Player2Bar>
      </StatusContainer>
      <Result>
        {result}
      </Result>
    </TopBarContainer>
  );

  const renderStartOverlay = () => (
    <Overlay isStarted={isStarted}>
      <StartOver onClick={!isStarted ? handleStartButton : null}>
        PLAY
      </StartOver>
    </Overlay>
  );

  return (
    <Layout>
      <GlobalStyles />
      <LeftSide>
        <Parag>P1 Move:</Parag>
        <Parag>a/w/d</Parag>
        <Parag>P1 Attack:</Parag>
        <Parag>Space</Parag>
      </LeftSide>
      <MiddleSide>
        <Container>
          {renderHealthBar()}
          {renderStartOverlay()}
          <Canvas ref={canvasRef} />
        </Container>
        <Footer>Recreate by xyLou, a tutorial by <a href="https://www.youtube.com/watch?v=vyqbNFMDRGQ&list=PLpPnRKq7eNW16Wq1GQjQjpTo_E0taH0La&index=6">Chris Course</a></Footer>
      </MiddleSide>
      <RightSide>
        <Parag>P2 Move:</Parag>
        <Parag>←/↑/→</Parag>
        <Parag>P2 Attack:</Parag>
        <Parag>Enter</Parag>
      </RightSide>
    </Layout>
  );
}

export default App;
