const pet = {
    name: "Lapinou",
    species: "rabbit",
    image: "assets/Lapin-joie.png",
    hunger: 100,
    energy: 100,
    happiness: 100,
    level: 1,
    xp: 0,
    isAlive: true,
    archived: false,
};

const petImage = document.querySelector('.zone-pet img');
const sleepZzz = document.getElementById('sleep-zzz');
const dialogText = document.querySelector('.dialog-text');
const dialogZone = document.getElementById('dialog-zone');
const restartModal = document.getElementById('restart-modal');
const historyModal = document.getElementById('history-modal');
const petActionButtons = ['btn-feed', 'btn-play', 'btn-sleep', 'btn-heal']
    .map((id) => document.getElementById(id));
let isSleeping = false;
let isEating = false;
let reaction = null;
let sleepTimeout;
let eatTimeout;
let reactionTimeout;
let actionCooldownTimeout;
let dialogTimeout;
const defaultDialogMessage = 'Coucou, je suis ton Tamagotchi!';
const petEmotionAssets = {
    frog: {
        sad: 'assets/frog-sad.png',
        sleepy: 'assets/frog-sleepy.png',
        eating: 'assets/frog-eating.png',
        angry: 'assets/frog-angry.png',
        perplexed: 'assets/frog-perplexe.png',
        happy: 'assets/frog-happy.png',
        surprised: 'assets/frog-surprised.png',
    },
    chick: {
        sad: 'assets/chick-sad.png',
        sleepy: 'assets/chick-sleepy.png',
        eating: 'assets/chick-eating.png',
        angry: 'assets/chick-angry.png',
        perplexed: 'assets/chick-perplexe.png',
        happy: 'assets/chick-happy.png',
        surprised: 'assets/chick-surprised.png',
    },
    cat: {
        sad: 'assets/cat-sad.png',
        sleepy: 'assets/cat-sleepy.png',
        eating: 'assets/cat-eating.png',
        angry: 'assets/cat-angry.png',
        perplexed: 'assets/cat-perplexe.png',
        happy: 'assets/cat-happy.png',
        surprised: 'assets/cat-surprised.png',
    },
    dog: {
        sad: 'assets/dog-sad.png',
        sleepy: 'assets/dog-sleepy.png',
        eating: 'assets/dog-eating.png',
        angry: 'assets/dog-angry.png',
        perplexed: 'assets/dog-perplexe.png',
        happy: 'assets/dog-happy.png',
        surprised: 'assets/dog-surprised.png',
    },
    otter: {
        sad: 'assets/otter-sad.png',
        sleepy: 'assets/otter-sleepy.png',
        eating: 'assets/otter-eating.png',
        angry: 'assets/otter-angry.png',
        perplexed: 'assets/otter-perplexe.png',
        happy: 'assets/otter-happy.png',
        surprised: 'assets/otter-surprised.png',
    },
};

function showDialogMessage(message, duration = 3000) {
    if (!dialogText || !dialogZone) return;

    clearTimeout(dialogTimeout);
    dialogText.textContent = message;
    dialogZone.setAttribute('aria-hidden', 'false');

    if (duration !== null) {
        dialogTimeout = setTimeout(() => {
            if (dialogText.textContent === message) {
                hideDialog();
            }
        }, duration);
    }
}

function hideDialog() {
    if (!dialogText || !dialogZone) return;

    clearTimeout(dialogTimeout);
    dialogText.replaceChildren();
    dialogZone.setAttribute('aria-hidden', 'true');
}

function startActionCooldown() {
    if (petActionButtons.some((button) => button.disabled)) return false;

    petActionButtons.forEach((button) => {
        button.disabled = true;
    });

    actionCooldownTimeout = setTimeout(() => {
        petActionButtons.forEach((button) => {
            button.disabled = false;
        });
    }, 2000);

    return true;
}

function playAnimation() {
    if (!petImage) return;
    petImage.classList.remove('play-animation');
    void petImage.offsetWidth;
    petImage.classList.add('play-animation');
}

function updateUI() {
    document.getElementById('pet-name').textContent = pet.name;
    document.getElementById('hunger-text').textContent = `${pet.hunger} / 100`;
    document.getElementById('energy-text').textContent = `${pet.energy} / 100`;
    document.getElementById('happiness-text').textContent = `${pet.happiness} / 100`;

    document.getElementById('hunger-bar').style.width = `${pet.hunger}%`;
    document.getElementById('energy-bar').style.width = `${pet.energy}%`;
    document.getElementById('happiness-bar').style.width = `${pet.happiness}%`;

    const levelElement = document.getElementById('pet-level');
    if (levelElement) {
        levelElement.textContent = `Niveau : ${pet.level} (XP: ${pet.xp}/100)`;
    }

    document.getElementById('btn-restart').hidden = pet.isAlive;
    updateAvatar();
}

function updateAvatar() {
    if (!petImage) return;

    if (sleepZzz) sleepZzz.hidden = !isSleeping || !pet.isAlive;

    const hasLowStat =
        pet.hunger < 50 || pet.energy < 50 || pet.happiness < 50;
    const emotionAssets = petEmotionAssets[pet.species];

    if (!pet.isAlive) {
        petImage.src = emotionAssets?.sad || 'assets/Lapin-sad.png';
        petImage.alt = `${pet.name} looking sad`;
    } else if (isSleeping) {
        petImage.src = emotionAssets?.sleepy || 'assets/Lapin-dodo.png';
        petImage.alt = `${pet.name} sleeping`;
    } else if (isEating) {
        petImage.src = emotionAssets?.eating || 'assets/Lapin-eat.png';
        petImage.alt = `${pet.name} eating`;
    } else if (pet.hunger < 25 && emotionAssets?.angry) {
        petImage.src = emotionAssets.angry;
        petImage.alt = `${pet.name} looking hungry`;
    } else if (hasLowStat) {
        petImage.src = emotionAssets?.perplexed || 'assets/Lapin-perplexe.png';
        petImage.alt = `${pet.name} looking perplexed`;
    } else if (reaction === 'happy' && emotionAssets?.happy) {
        petImage.src = emotionAssets.happy;
        petImage.alt = `${pet.name} looking happy`;
    } else if (reaction === 'surprised' && emotionAssets?.surprised) {
        petImage.src = emotionAssets.surprised;
        petImage.alt = `${pet.name} looking surprised`;
    } else {
        petImage.src = pet.image;
        petImage.alt = pet.name;
    }
}

function showReaction(mood, duration = 2000) {
    clearTimeout(reactionTimeout);
    reaction = mood;
    updateAvatar();
    reactionTimeout = setTimeout(() => {
        reaction = null;
        updateAvatar();
    }, duration);
}

function showDeathMessage() {
    if (!dialogText || !dialogZone) return;

    clearTimeout(dialogTimeout);
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.setAttribute('aria-hidden', 'true');
    icon.classList.add('dialog-icon');

    const skull = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    skull.setAttribute(
        'd',
        'M9 22H7v-2h2v2Zm4 0h-2v-2h2v2Zm4 0h-2v-2h2v2ZM7 20H5v-4H3v-2h4v6Zm4 0H9v-4h2v4Zm4 0h-2v-4h2v4Zm6-4h-2v4h-2v-6h4v2ZM3 14H1V4h2v10Zm20 0h-2V4h2v10Zm-13-3H8V7h2v4Zm6 0h-2V7h2v4Zm5-7H3V2h18v2Z'
    );
    skull.setAttribute('fill', 'currentColor');
    icon.append(skull);

    dialogText.replaceChildren(
        document.createTextNode(`Vous n'avez pas su prendre soin de ${pet.name}... `),
        icon
    );
    dialogZone.setAttribute('aria-hidden', 'false');
}

// --- SYSTÈME DE SAUVEGARDE ---
function saveGame() {
    localStorage.setItem('tamagotchiSave', JSON.stringify(pet));
}

function getPetHistory() {
    const savedHistory = JSON.parse(localStorage.getItem('tamagotchiHistory') || '[]');
    if (!Array.isArray(savedHistory)) {
        throw new Error('Saved Tamagotchi history is not a list.');
    }
    return savedHistory;
}

function archiveCurrentPet() {
    if (pet.archived) return;

    pet.id ||= `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const history = getPetHistory();
    history.unshift({
        id: pet.id,
        name: pet.name,
        species: pet.species,
        level: pet.level,
        xp: pet.xp,
        endedAt: new Date().toISOString(),
    });

    localStorage.setItem('tamagotchiHistory', JSON.stringify(history));
    pet.archived = true;
    saveGame();
}

function removePetFromHistory(petId) {
    const history = getPetHistory().filter((entry) => entry.id !== petId);
    localStorage.setItem('tamagotchiHistory', JSON.stringify(history));
    pet.archived = false;
}

function showPetHistory() {
    const history = getPetHistory();
    const historyList = document.getElementById('history-list');
    const emptyMessage = document.getElementById('history-empty');
    const speciesNames = {
        rabbit: 'Lapin',
        frog: 'Grenouille',
        chick: 'Poussin',
        cat: 'Chat',
        dog: 'Chien',
        otter: 'Loutre',
    };
    historyList.replaceChildren();
    emptyMessage.hidden = history.length > 0;

    history.forEach((entry) => {
        const item = document.createElement('li');
        const date = new Date(entry.endedAt).toLocaleDateString('fr-FR');
        item.textContent =
            `${entry.name} (${speciesNames[entry.species] || 'Tamagotchi'}) — ` +
            `Niveau ${entry.level}, ${entry.xp} XP — ${date}`;
        historyList.append(item);
    });

    historyModal.showModal();
}

function loadGame() {
    const savedData = localStorage.getItem('tamagotchiSave');
    if (savedData) {
        const loadedPet = JSON.parse(savedData);
        Object.assign(pet, loadedPet);
        const setupData = JSON.parse(localStorage.getItem('tamagotchiSetup') || '{}');
        pet.species = loadedPet.species
            || setupData.species
            || (loadedPet.image?.includes('frog-')
                ? 'frog'
                : loadedPet.image?.includes('chick-')
                    ? 'chick'
                    : loadedPet.image?.includes('cat-')
                        ? 'cat'
                        : loadedPet.image?.includes('dog-')
                            ? 'dog'
                            : loadedPet.image?.includes('otter-')
                                ? 'otter'
                                : 'rabbit');
        if (!['rabbit', 'frog', 'chick', 'cat', 'dog', 'otter'].includes(pet.species)) {
            pet.species = 'rabbit';
        }
        if (!loadedPet.image) {
            const defaultImages = {
                rabbit: 'assets/Lapin-joie.png',
                frog: 'assets/frog-default.png',
                chick: 'assets/chick-default.png',
                cat: 'assets/cat-default.png',
                dog: 'assets/dog-default.png',
                otter: 'assets/otter-default.png',
            };
            pet.image = defaultImages[pet.species];
        }
        if (!pet.id) {
            pet.id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        }
        pet.archived = Boolean(loadedPet.archived);
    }
}
// -----------------------------

const updateInterval = 30000;

function liveCycle() {
    if (!pet.isAlive || document.hidden) return;

    pet.hunger = Math.max(0, pet.hunger - 2);
    pet.energy = Math.max(0, pet.energy - 1);
    pet.happiness = Math.max(0, pet.happiness - 2);

    checkPetDeath();

    updateUI();
    saveGame();
}

function checkPetDeath() {
    if (!pet.isAlive || (pet.hunger > 0 && pet.energy > 0)) return false;

    pet.isAlive = false;
    archiveCurrentPet();
    showDeathMessage();
    return true;
}

function gainXP(amount) {
    if (!pet.isAlive) return;

    pet.xp += amount;

    if (pet.xp >= 100) {
        pet.level += 1;
        pet.xp = pet.xp - 100;
        showReaction('surprised');
        showDialogMessage(`Félicitations! ${pet.name} passe au niveau ${pet.level}!`);
    }

    updateAvatar();
}

// Choix de redémarrage après la mort du Tamagotchi
document.getElementById('btn-restart').addEventListener('click', function() {
    restartModal.showModal();
});

document.getElementById('btn-keep-pet').addEventListener('click', function() {
    clearTimeout(sleepTimeout);
    clearTimeout(eatTimeout);
    clearTimeout(reactionTimeout);
    isSleeping = false;
    isEating = false;
    reaction = null;
    removePetFromHistory(pet.id);
    pet.hunger = 100;
    pet.energy = 100;
    pet.happiness = 100;
    pet.isAlive = true;
    restartModal.close();
    showDialogMessage(`Bon retour, ${pet.name} !`);
    updateUI();
    saveGame();
});

document.getElementById('btn-new-pet').addEventListener('click', function() {
    clearTimeout(sleepTimeout);
    clearTimeout(eatTimeout);
    clearTimeout(reactionTimeout);
    archiveCurrentPet();
    localStorage.removeItem('tamagotchiSave');
    localStorage.removeItem('tamagotchiSetup');
    window.location.assign('create.html');
});

document.getElementById('btn-cancel-restart').addEventListener('click', function() {
    restartModal.close();
});

document.getElementById('btn-history').addEventListener('click', showPetHistory);
document.getElementById('btn-close-history').addEventListener('click', function() {
    historyModal.close();
});

// Bouton NOURRIR
document.getElementById('btn-feed').addEventListener('click', function() {
    if (!pet.isAlive || !startActionCooldown()) return;

    pet.hunger = Math.min(100, pet.hunger + 25);

    isEating = true;
    updateAvatar();
    clearTimeout(eatTimeout);
    eatTimeout = setTimeout(function() {
        isEating = false;
        updateAvatar();
        if (pet.isAlive && dialogText) {
            const ateMessage = `${pet.name} a bien mangé !`;
            showDialogMessage(ateMessage);
        }
    }, 2000);

    gainXP(5);
    updateUI();
    saveGame(); // Sauvegarde après l'action
});

// Bouton JOUER
document.getElementById('btn-play').addEventListener('click', function() {
    if (!pet.isAlive || !startActionCooldown()) return;

    clearTimeout(reactionTimeout);
    reaction = 'happy';
    if (petImage) playAnimation();

    pet.happiness = Math.min(100, pet.happiness + 20);
    pet.hunger = Math.max(0, pet.hunger - 3);
    pet.energy = Math.max(0, pet.energy - 2);

    if (checkPetDeath()) {
        updateUI();
        saveGame();
        return;
    }
    gainXP(15);
    updateUI();
    reactionTimeout = setTimeout(() => {
        reaction = null;
        updateAvatar();
    }, 2000);
    saveGame();
});

// Bouton DORMIR
document.getElementById('btn-sleep').addEventListener('click', function() {
    if (!pet.isAlive || !startActionCooldown()) return;

    pet.energy = Math.min(100, pet.energy + 35);

    isSleeping = true;
    reaction = null;
    clearTimeout(reactionTimeout);
    updateAvatar();
    clearTimeout(sleepTimeout);
    sleepTimeout = setTimeout(function() {
        isSleeping = false;
        updateAvatar();
        if (pet.isAlive && dialogText) {
            const awakeMessage = `${pet.name} est réveillé et en pleine forme !`;
            showDialogMessage(awakeMessage);
        }
    }, 2000);

    gainXP(5);
    updateUI();
    saveGame();
});

// Bouton SOIGNER
document.getElementById('btn-heal').addEventListener('click', function() {
    if (!pet.isAlive || !startActionCooldown()) return;

    pet.hunger = 100;
    pet.energy = 100;
    pet.happiness = 100;

    showReaction('happy');
    updateUI();
    saveGame();
});

// --- LANCEMENT DU JEU ---
loadGame(); // On charge la sauvegarde s'il y en a une au démarrage
if (!pet.isAlive && dialogText) {
    archiveCurrentPet();
    showDeathMessage();
} else if (localStorage.getItem('tamagotchiWelcomePending') === 'true') {
    localStorage.removeItem('tamagotchiWelcomePending');
    showDialogMessage(defaultDialogMessage, 4000);
}
updateUI(); // On affiche l'interface
setInterval(liveCycle, updateInterval); // On lance le temps