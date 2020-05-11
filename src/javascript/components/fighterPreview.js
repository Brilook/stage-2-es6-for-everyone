import { createElement } from '../helpers/domHelper';

export function createFighterPreview(fighter, position) {
  const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
  const fighterElement = createElement({
    tagName: 'div',
    className: `fighter-preview___root ${positionClassName}`,
  });
  
  if (fighter) {
    fighterElement.append(createFighterImage(fighter));
    const positionClassName = position === 'right' ? 'fighter-detals-info___right' : 'fighter-detals-info___left';

    const fighterDetalsInfo = createElement({
      tagName: 'div',
      className: `fighter-detals-info ${positionClassName}`
    });
    fighterElement.append(fighterDetalsInfo);

// todo: add loop; 
    let name = createElement({
      tagName: 'span',
      className: 'fighter-detals-info-name'
    });
    name.innerText = `${fighter.name}`;
    fighterDetalsInfo.append(name);

    let health = createElement({
      tagName: 'span',
      className: 'fighter-detals-info-elem'
    });
    health.innerText = `Health - ${fighter.health}`;
    fighterDetalsInfo.append(health);
 
    let attack = createElement({
      tagName: 'span',
      className: 'fighter-detals-info-elem'
    });
    attack.innerText = `Attack - ${fighter.attack}`;
    fighterDetalsInfo.append(attack);

    let defense = createElement({
      tagName: 'span',
      className: 'fighter-detals-info-elem'
    });
    defense.innerText = `Defense - ${fighter.defense}`;
    fighterDetalsInfo.append(defense);

  }

  return fighterElement;
}

export function createFighterImage(fighter) {
  const { source, name } = fighter;
  const attributes = { 
    src: source, 
    title: name,
    alt: name 
  };
  const imgElement = createElement({
    tagName: 'img',
    className: 'fighter-preview___img',
    attributes,
  });

  return imgElement;
}
