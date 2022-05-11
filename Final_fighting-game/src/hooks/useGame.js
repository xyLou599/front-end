/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";

import { Sprite } from "../model/Sprite";
import { Fighter } from '../model/Fighter';
import winAudio from '../assets/audios/win.mp3';
import shopImg from '../assets/images/shop.png';
import hitAudio from '../assets/audios/hit.mp3';
import drawAudio from '../assets/audios/draw.mp3';
import slashAudio from '../assets/audios/slash.mp3';
import starterAudio from '../assets/audios/starter.mp3';
import player1Run from '../assets/images/p1/Run.png';
import player1Jump from '../assets/images/p1/Jump.png';
import player1Idle from '../assets/images/p1/Idle.png';
import player1Fall from '../assets/images/p1/Fall.png';
import player1Attack1 from '../assets/images/p1/Attack1.png';
import player1TakeHit from '../assets/images/p1/Take Hit - white silhouette.png';
import player1Death from '../assets/images/p1/Death.png';
import player2Run from '../assets/images/p2/Run.png';
import player2Jump from '../assets/images/p2/Jump.png';
import player2Idle from '../assets/images/p2/Idle.png';
import player2Fall from '../assets/images/p2/Fall.png';
import player2Attack1 from '../assets/images/p2/Attack1.png';
import player2TakeHit from '../assets/images/p2/Take hit.png';
import player2Death from '../assets/images/p2/Death.png';
import backgroundImg from '../assets/images/background.png';
import { TIE, PLAYER_1_WIN, PLAYER_2_WIN, TIMES } from '../utils/constant';

const useGame = () => {
  const [timer, setTimer] = useState(TIMES);
  const [result, setResult] = useState('');
  const [isStarted, setIsStarted] = useState(false);

  const [player1Health, setPlayer1Health] = useState(100);
  const [player2Health, setPlayer2Health] = useState(100);

  const clockRef = useRef(null);
  const player1Ref = useRef(null);
  const player2Ref = useRef(null);
  const counter = useRef(timer);
  const canvasRef = useRef(null);
  const resultRef = useRef(result);
  const startedRef = useRef(isStarted);
  const winSound = useRef(new Audio(winAudio));
  const hitSound1 = useRef(new Audio(hitAudio));
  const hitSound2 = useRef(new Audio(hitAudio));
  const drawSound = useRef(new Audio(drawAudio));
  const slashSound1 = useRef(new Audio(slashAudio));
  const slashSound2 = useRef(new Audio(slashAudio));
  const starterSound = useRef(new Audio(starterAudio));
  const player1HealthRef = useRef(player1Health);
  const player2HealthRef = useRef(player2Health);

  const veloWalk = 5;
  const veloJump = 20;

  const keys = {
    a: { pressed: false },
    d: { pressed: false },
    ArrowLeft: { pressed: false },
    ArrowRight: { pressed: false },
  };

  useEffect(() => {
    muteAudio();
    initCanvas();

    const { player1, player2, background, ctx, shop } = initSprites();
    player1Ref.current = player1;
    player2Ref.current = player2;

    animate({ player1, player2, background, ctx, shop });

    initEventListener(player1, player2);
  }, []);

  useEffect(() => {
    if (isStarted) {
      muteAudio();
      winSound.current.muted = false;
      hitSound1.current.muted = false;
      hitSound2.current.muted = false;
      drawSound.current.muted = false;
      starterSound.current.muted = false;
      slashSound1.current.muted = false;
      slashSound2.current.muted = false;

      starterSound.current.play();
      setTimeout(() => {
        runTimer();
      }, 1000);
    }
  }, [isStarted]);

  const muteAudio = () => {
    winSound.current.muted = true;
    hitSound1.current.muted = true;
    hitSound2.current.muted = true;
    drawSound.current.muted = true;
    starterSound.current.muted = true;
    slashSound1.current.muted = true;
    slashSound2.current.muted = true;
  };

  const runTimer = () => {
    if (counter.current === 0) {
      let finalResult = result;
      if (player1HealthRef.current === player2HealthRef.current) {
        finalResult = TIE;
      } else if (player1HealthRef.current > player2HealthRef.current) {
        finalResult = PLAYER_1_WIN;
      } else {
        finalResult = PLAYER_2_WIN;
      }
      if (finalResult === TIE) {
        playSound(drawSound);
      } else {
        playSound(winSound);
      }
      resultRef.current = finalResult;
      setResult(finalResult);
      setTimeout(() => {
        setIsStarted(false);
        startedRef.current = false;
      }, 1000);
    }
    if (counter.current > 0) {
      counter.current = counter.current - 1
      setTimer(prev => prev - 1);
      clockRef.current = setTimeout(runTimer, 1000);
    }

  };

  const initEventListener = (player1, player2) => {
    window.addEventListener('keydown', onKeydown(player1, player2));
    window.addEventListener('keyup', onKeyup(player1, player2));
  };

  const onKeydown = (player1, player2) => (e) => {
    if (!resultRef.current && startedRef.current) {
      switch (e.key) {
        // player 1
        case 'a':
          keys.a.pressed = true;
          player1.lastKey = 'a';
          break;
        case 'd':
          keys.d.pressed = true;
          player1.lastKey = 'd';
          break;
        case 'w':
          player1.velo.y = -veloJump;
          break;
        case ' ':
          if (player1.image !== player1.sprites.takeHit.image) {
            player1.attack();
          }
          break;
        //  player 2
        case 'ArrowLeft':
          keys.ArrowLeft.pressed = true;
          player2.lastKey = 'ArrowLeft';
          break;
        case 'ArrowRight':
          keys.ArrowRight.pressed = true;
          player2.lastKey = 'ArrowRight';
          break;
        case 'ArrowUp':
          player2.velo.y = -veloJump;
          break;
        case 'Enter':
          if (player2.image !== player2.sprites.takeHit.image) {
            player2.attack();
          }
          break;
        default:
          break;
      }
    }
  };

  const onKeyup = () => (e) => {
    if (!resultRef.current && startedRef.current) {
      switch (e.key) {
        // player 1
        case 'a':
          keys.a.pressed = false;
          break;
        case 'd':
          keys.d.pressed = false;
          break;
        // player 2
        case 'ArrowLeft':
          keys.ArrowLeft.pressed = false;
          break;
        case 'ArrowRight':
          keys.ArrowRight.pressed = false;
          break;
        default:
          break;
      }
    }
  };

  const initCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvasRef.current.getContext('2d');

    canvas.width = 1024;
    canvas.height = 576;

    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const initSprites = () => {
    const ctx = canvasRef.current.getContext('2d');

    const background = new Sprite({
      pos: { x: 0, y: 0 },
      image: backgroundImg,
    })

    const shop = new Sprite({
      pos: { x: 650, y: 161 },
      image: shopImg,
      scale: 2.5,
      frames: 6,
    })

    const player1 = new Fighter({
      velo: { x: 0, y: 4 },
      pos: { x: 70, y: 0 },
      height: 150,
      width: 80,
      color: 'red',
      attColor: 'blue',
      charOffset: { x: 200, y: 155 },
      image: player1Idle,
      frames: 8,
      scale: 2.5,
      attackBox: {
        offset: { x: 115, y: 60 },
        width: 150,
        height: 50,
      },
      sprites: {
        idle: {
          src: player1Idle,
          frames: 8
        },
        run: {
          src: player1Run,
          frames: 8
        },
        jump: {
          src: player1Jump,
          frames: 2
        },
        fall: {
          src: player1Fall,
          frames: 2
        },
        attack1: {
          src: player1Attack1,
          frames: 6
        },
        takeHit: {
          src: player1TakeHit,
          frames: 4
        },
        death: {
          src: player1Death,
          frames: 6,
        }
      }
    });

    const player2 = new Fighter({
      velo: { x: 0, y: 4 },
      pos: { x: 500, y: 100 },
      height: 150,
      width: 50,
      color: 'green',
      attColor: 'purple',
      charOffset: { x: 200, y: 137 },
      image: player2Idle,
      frames: 4,
      scale: 2.25,
      attackBox: {
        offset: { x: -150, y: 60 },
        width: 120,
        height: 50,
      },
      sprites: {
        idle: {
          src: player2Idle,
          frames: 4
        },
        run: {
          src: player2Run,
          frames: 8
        },
        jump: {
          src: player2Jump,
          frames: 2
        },
        fall: {
          src: player2Fall,
          frames: 2
        },
        attack1: {
          src: player2Attack1,
          frames: 4
        },
        takeHit: {
          src: player2TakeHit,
          frames: 3
        },
        death: {
          src: player2Death,
          frames: 7,
        }
      }
    });

    return { player1, player2, background, shop, ctx }
  };

  const rectangularCollision = (rect1, rect2) => {
    return (rect1.attackBox.pos.x + rect1.attackBox.width >= rect2.pos.x)
      && (rect1.attackBox.pos.x <= rect2.pos.x + rect2.width)
      && (rect1.attackBox.pos.y + rect1.attackBox.height >= rect2.pos.y)
      && (rect1.attackBox.pos.y <= rect2.pos.y + rect2.height)
  };

  const handleAttack = (setter, ref, winMsg, opponenet, attacker) => {
    const decrement = 20;
    if (ref.current > 0) {
      ref.current = ref.current - decrement;
      setter(prev => prev - decrement);

      if (ref.current === 0) {
        clearTimeout(clockRef.current);
        opponenet.switchSprite('death');
        resultRef.current = winMsg;
        setResult(winMsg);
        playSound(winSound);
        setTimeout(() => {
          setIsStarted(false);
          startedRef.current = false;
        }, 1000);
      }
    }
  };

  const playSound = sound => {
    sound.current.volume = 0.5;
    sound.current.pause();
    sound.current.currentTime = 0;
    sound.current.play();
  };

  const handleStartButton = () => {
    setIsStarted(true);
    startedRef.current = true;

    handleRestart();
  };

  const handleRestart = () => {
    setPlayer1Health(100)
    setPlayer2Health(100);
    player1HealthRef.current = 100;
    player2HealthRef.current = 100;

    setTimer(TIMES);
    counter.current = TIMES;

    player1Ref.current.pos = { x: 70, y: 0 };
    player1Ref.current.isDead = false;
    player1Ref.current.switchSprite('idle', true);

    player2Ref.current.pos = { x: 500, y: 100 };
    player2Ref.current.isDead = false;
    player2Ref.current.switchSprite('idle', true);

    setResult('');
    resultRef.current = '';
  };

  const animate = (params) => {
    const { player1, player2, background, ctx, shop } = params;
    window.requestAnimationFrame(() => animate(params));

    const canvas = canvasRef.current;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    background.update(ctx);
    shop.update(ctx);

    player1.update(ctx, canvas);
    player2.update(ctx, canvas);


    // handle movement
    // player - 1
    player1.velo.x = 0;
    if (keys.a.pressed && player1.lastKey === 'a') {
      player1.velo.x = -veloWalk;
      player1.switchSprite('run');
    } else if (keys.d.pressed && player1.lastKey === 'd') {
      player1.velo.x = veloWalk
      player1.switchSprite('run');
    } else {
      player1.switchSprite('idle');
    }
    if (player1.velo.y < 0) {
      player1.switchSprite('jump');
    } else if (player1.velo.y > 0) {
      player1.switchSprite('fall');
    }

    // player - 2
    player2.velo.x = 0;
    if (keys.ArrowLeft.pressed && player2.lastKey === 'ArrowLeft') {
      player2.velo.x = -veloWalk;
      player2.switchSprite('run');
    } else if (keys.ArrowRight.pressed && player2.lastKey === 'ArrowRight') {
      player2.velo.x = veloWalk
      player2.switchSprite('run');
    } else {
      player2.switchSprite('idle');
    }
    if (player2.velo.y < 0) {
      player2.switchSprite('jump');
    } else if (player2.velo.y > 0) {
      player2.switchSprite('fall');
    }

    // disable players movement when finish
    if (resultRef.current) {
      player1.lastKey = '';
      player2.lastKey = '';
      player1.velo.x = 0;
      player2.velo.x = 0;

      if (player1HealthRef.current > 0 && player2HealthRef.current > 0) {
        player1.switchSprite('idle');
        player2.switchSprite('idle');
      }
      if (player1.isDead) player2.switchSprite('idle');
      if (player2.isDead) player1.switchSprite('idle');
    }

    // detect collision
    // player - 1
    if (rectangularCollision(player1, player2) && player1.isAttacking && player1.framesCurrent === 4) {
      handleAttack(setPlayer2Health, player2HealthRef, PLAYER_1_WIN, player2, player1);
      playSound(hitSound1);
      player2.takeHit();
      player1.isAttacking = false;
    }
    if (player1.isAttacking && player1.framesCurrent === 4) {
      playSound(slashSound1);
      player1.isAttacking = false;
    }
    // player - 2
    if (rectangularCollision(player2, player1) && player2.isAttacking && player2.framesCurrent === 2) {
      handleAttack(setPlayer1Health, player1HealthRef, PLAYER_2_WIN, player1, player2);
      playSound(hitSound2);
      player1.takeHit();
      player2.isAttacking = false;
    }
    if (player2.isAttacking && player2.framesCurrent === 2) {
      playSound(slashSound2);
      player2.isAttacking = false;
    }
  };

  return {
    timer,
    result,
    canvasRef,
    isStarted,
    player1Health,
    player2Health,
    handleStartButton,
  };
};

export { useGame };
