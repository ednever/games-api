const vue = Vue.createApp({
    data() {
        return {
            gameInModal: {name: null},
            games: [],
            newGame: { id: null, name: null, price: null }
        }
    },
    async created() {
        this.games = await (await fetch('http://localhost:8080/games')).json();
    },
    methods: {
        getGame: async function (id) {
            this.gameInModal = await (await fetch(`http://localhost:8080/games/${id}`)).json()
            let gameInfoModal = new bootstrap.Modal(document.getElementById('gameInfoModal'), {})
            gameInfoModal.show()
        },
        addGame: async function () {
            // Подготовка данных для отправки на сервер
            const data = {
                id: this.newGame.id,
                name: this.newGame.name,
                price: this.newGame.price
            };

            // Отправка POST-запроса для добавления новой игры
            const response = await fetch('http://localhost:8080/games/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                // Если запрос успешен, обновляем список игр или выполняем другие действия
                this.games = await response.json();
            } else {
                // Обработка ошибки, если не удалось добавить игру
                console.error('Ошибка при добавлении игры');
            }
        }
    }
}).mount('#app')