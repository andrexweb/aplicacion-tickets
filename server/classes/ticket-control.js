const fs = require('fs');

class Tickets {

    constructor(numero, escritorio) {
        this.numero = numero;
        this.escritorio = escritorio;
    }

}

const limiteTicket = 4;

class TicketControl {

    constructor() {

        this.ultimo = 0;
        this.hoy = new Date().getDate();
        this.tickets = [];
        this.ultimos = [];

        let data = require('../data/data.json');

        if (data.hoy === this.hoy) {
            this.ultimo = data.ultimo;
            this.tickets = data.tickets || [];
            this.ultimos = data.ultimos || [];
        } else {
            this.reiniciarConteo();
        }
    }

    siguiente() {

        this.ultimo += 1;

        let ticket = new Tickets(this.ultimo, null);
        this.tickets.push(ticket);

        this.grabarArchivo();
        return this.getUltimoTicket();
    }

    getUltimoTicket() {
        return `Ticket ${ this.ultimo }`;
    }

    getUltimos() {
        return this.ultimos;
    }

    atenderTicket(escritorio) {

        if (this.tickets.length === 0) {
            return 'No hay tickets';
        }

        let numeroTicket = this.tickets[0].numero;
        this.tickets.shift();

        let atenderTicket = new Tickets(numeroTicket, escritorio);

        this.ultimos.unshift(atenderTicket);

        if (this.ultimos.length > limiteTicket) {
            this.ultimos.splice(-1, 1);
        }
        console.log('Ultimos ', limiteTicket);
        console.log(this.ultimos);

        this.grabarArchivo();

        return atenderTicket;
    }

    reiniciarConteo() {

        this.ultimo = 0;
        this.tickets = [];
        this.ultimos = [];
        this.grabarArchivo();
        console.log('Se ha inicializado el sistema!');
    }

    grabarArchivo() {
        let jsonData = {
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimos: this.ultimos
        };

        let jsonDataString = JSON.stringify(jsonData);

        fs.writeFileSync('./server/data/data.json', jsonDataString);
    }



}


module.exports = {
    TicketControl
}