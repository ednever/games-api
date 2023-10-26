const vue = Vue.createApp({
    data() {
        return {
            games: [],
            newGame: {
                name: '',
                price: 0
            }
        };
    },
    async created() {
        this.games = await (await fetch('http://localhost:8080/games')).json();
        this.games.forEach(game => game.editing = false);
    },
    methods: {
        sortGames() {
            this.games.sort((a, b) => a.price - b.price);
            if (document.getElementById(`nameB`).innerHTML === `↓`) {
                document.getElementById(`nameB`).innerHTML = `↑`;
                document.getElementById(`nameA`).innerHTML = `↓`
            }
            else{
                document.getElementById(`nameB`).innerHTML = `↓`
            }
            
        },
        sortGamesByName() {
            this.games.sort((a, b) => a.name.localeCompare(b.name));
            if (document.getElementById(`nameA`).innerHTML === `↓`) {
                document.getElementById(`nameA`).innerHTML = `↑`;
                document.getElementById(`nameB`).innerHTML = `↓`
            }
            else{
                document.getElementById(`nameA`).innerHTML = `↓`
            }
        },
        editGameName(game) {
            game.editing = true;
            game.newName = game.name;
        },
        editGamePrice(game) {
            game.editing = true;
            game.newPrice = game.price;
        },
        updateGame(game) {
            // Создайте объект с обновленными данными
            const updatedGameData = {
                name: game.newName,
                price: parseFloat(game.newPrice)
            };

            // Отправьте запрос PUT на сервер для обновления данных игры
            fetch(`http://localhost:8080/games/${game.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedGameData)
            })
            .then(response => {
                if (response.ok) {
                    // Если обновление прошло успешно, завершите редактирование
                    game.editing = false;
                    game.name = game.newName;
                    game.price = parseFloat(game.newPrice);
                } else {
                    console.error('Ошибка при обновлении игры на сервере');
                }
            })
            .catch(error => {
                console.error('Произошла ошибка:', error);
            });
        },
                addGame: async function() {
                    const response = await fetch('http://localhost:8080/games', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(this.newGame)
                    });
                    if (response.ok) {
                        const newGame = await response.json();
                        newGame.editing = false;
                        this.games.push(newGame);
                        this.newGame = { name: '', price: 0 };
                    }
                },
                deleteGame: async function(id) {
                    const response = await fetch(`http://localhost:8080/games/${id}`, {
                        method: 'DELETE'
                    });
                    if (response.ok) {
                        this.games = this.games.filter(game => game.id !== id);
                    }
                }
    }
}).mount('#app');