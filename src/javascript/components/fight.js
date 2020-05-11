import {
  controls
} from '../../constants/controls';

export async function fight(leftFighter, rightFighter) {
  leftFighter.initialHealth = leftFighter.health;
  rightFighter.initialHealth = rightFighter.health;

  return new Promise((resolve) => {
    let deregisters = [];
    const checkWinner = function () {
      if (leftFighter.health <= 0 || rightFighter.health <= 0) {
        let winner = leftFighter.health <= 0 ? rightFighter : leftFighter;

        for ( let someFunction of deregisters){
          someFunction();
        }
        resolve(winner);
      }
    }

    let rightFighterBlocked = false;
    const rightFighterBlockStart = function () {
      rightFighterBlocked = true;
    }
    const rightFighterBlockEnd = function () {
      rightFighterBlocked = false;
    }

    deregisters.push(registerKeyHandler(controls.PlayerTwoBlock, rightFighterBlockStart, rightFighterBlockEnd));

    let leftFighterBlocked = false;
    const leftFighterBlockStart = function () {
      leftFighterBlocked = true;
    }
    const leftFighterBlockEnd = function () {
      leftFighterBlocked = false;
    }
    deregisters.push(registerKeyHandler(controls.PlayerOneBlock, leftFighterBlockStart, leftFighterBlockEnd));



    const leftFighterDamageHandler = function () {
      if (!rightFighterBlocked && !leftFighterBlocked) {
        rightFighter.health -= getDamage(leftFighter, rightFighter);
        updateHealthViews(leftFighter, rightFighter);
        checkWinner();

      }
    };
    deregisters.push(registerKeyHandler(controls.PlayerOneAttack, leftFighterDamageHandler));

    const rightFighterDamageHandler = function () {
      if (!leftFighterBlocked && !rightFighterBlocked) {
        leftFighter.health -= getDamage(rightFighter, leftFighter);
        updateHealthViews(leftFighter, rightFighter);
        checkWinner();
      }
    };
    deregisters.push(registerKeyHandler(controls.PlayerTwoAttack, rightFighterDamageHandler));






    const leftCriticalDamage = function () {
      rightFighter.health -= getCriticalDamage(leftFighter);
      updateHealthViews(leftFighter, rightFighter);
      checkWinner();

    }

    deregisters.push(registerMultipleKeyHandler(...controls.PlayerOneCriticalHitCombination, leftCriticalDamage));

    const rightCriticalDamage = function () {
      leftFighter.health -= getCriticalDamage(rightFighter);
      updateHealthViews(leftFighter, rightFighter);
      checkWinner();

    }

    deregisters.push(registerMultipleKeyHandler(...controls.PlayerTwoCriticalHitCombination, rightCriticalDamage));
  });

}

export function getDamage(attacker, defender) {
  const block = getBlockPower(defender);
  const attack = getHitPower(attacker);
  return block > attack ? 0 : attack - block;
}

function getCriticalDamage(attacker) {
  return 2 * attacker.attack;
}

export function getHitPower(fighter) {
  const criticalHitChance = Math.random() * 2 + 1;
  return fighter.attack * criticalHitChance;
}

export function getBlockPower(fighter) {
  const dodgeChance = Math.random() * 2 + 1;
  return fighter.defense * dodgeChance;
}

function registerMultipleKeyHandler(key1, key2, key3, downCallback) {

  let criticalKey1 = false;
  let criticalKey2 = false;
  let criticalKey3 = false;
  let lastCallbackDate = null;

  function check() {
    if (criticalKey1 && criticalKey2 && criticalKey3) {
      const dateNow = Date.now();
      if (!lastCallbackDate || dateNow - lastCallbackDate > 10000) {
        lastCallbackDate = dateNow;
        downCallback();

      }
    }
  }

  const down1 = function () {
    criticalKey1 = true;
    check();
  }
  const down2 = function () {
    criticalKey2 = true;
    check();
  }
  const down3 = function () {
    criticalKey3 = true;
    check();
  }

  const up1 = function () {
    criticalKey1 = false;
  }
  const up2 = function () {
    criticalKey2 = false;
  }
  const up3 = function () {
    criticalKey3 = false;
  }

  const deregister1 = registerKeyHandler(key1, down1, up1);
  const deregister2 = registerKeyHandler(key2, down2, up2);
  const deregister3 = registerKeyHandler(key3, down3, up3);


  return () => {
    deregister1();
    deregister2();
    deregister3();

  }
};

function registerKeyHandler(key, downCallback, upCallback) {

  const keyDown = function (event) {
    if (downCallback && event.code == key && event.repeat === false) {
      downCallback();
    }
  }

  const keyUp = function (event) {
    if (upCallback && event.code == key) {
      upCallback();
    }
  };

  document.addEventListener('keydown', keyDown);
  document.addEventListener('keyup', keyUp);

  const deregister = () => {
    document.removeEventListener('keydown', keyDown);
    document.removeEventListener('keyup', keyUp);
  }

  return deregister;
}

function updateHealthViews(leftFighter, rightFighter) {
  const rightIndicator = document.getElementById('right-fighter-indicator');
  const leftIndicator = document.getElementById('left-fighter-indicator');

  const restRightHealth = rightFighter.health * 100 / rightFighter.initialHealth;
  rightIndicator.style.background = `linear-gradient(90deg, #ebd759 ${restRightHealth}%, red 0)`;

  const restLeftHealth = leftFighter.health * 100 / leftFighter.initialHealth;
  leftIndicator.style.background = `linear-gradient(90deg, #ebd759 ${restLeftHealth}%, red 0)`;
}