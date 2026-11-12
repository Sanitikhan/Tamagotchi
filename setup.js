const setupForm = document.getElementById('setup-form');

setupForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(setupForm);
    const nameValue = formData.get('petName');
    const species = formData.get('species');
    const errorMessage = document.getElementById('setup-error');

    if (
        typeof nameValue !== 'string' ||
        !['rabbit', 'frog', 'chick', 'cat', 'dog', 'otter'].includes(species)
    ) return;

    const name = nameValue.trim();
    if (!name) {
        errorMessage.hidden = false;
        return;
    }

    errorMessage.hidden = true;

    const defaultImages = {
        rabbit: 'assets/Lapin-joie.png',
        frog: 'assets/frog-default.png',
        chick: 'assets/chick-default.png',
        cat: 'assets/cat-default.png',
        dog: 'assets/dog-default.png',
        otter: 'assets/otter-default.png',
    };

    const pet = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name,
        species,
        image: defaultImages[species],
        hunger: 100,
        energy: 100,
        happiness: 100,
        level: 1,
        xp: 0,
        isAlive: true,
        archived: false,
    };

    localStorage.setItem('tamagotchiSetup', JSON.stringify({ name, species }));
    localStorage.setItem('tamagotchiSave', JSON.stringify(pet));
    localStorage.setItem('tamagotchiWelcomePending', 'true');
    window.location.assign('index.html');
});
