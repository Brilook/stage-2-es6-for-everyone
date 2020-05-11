import { showModal } from '../modal/modal';
import { createFighterImage } from '../fighterPreview';

export function showWinnerModal(fighter) {
  const params = {
    title: fighter.name,
    bodyElement: createFighterImage(fighter),
    onClose: () => { window.location.reload(true)}
  }
  showModal(params);
}
