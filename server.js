var SerialPort = require('serialport'),
    Firebase = require('firebase'),
    config = require('./config'),
    portSelected = process.argv[2],
    myFirebaseRef = new Firebase("https://" + config.firebaseApp + ".firebaseio.com/" + config.firebaseAppRuta);


if (portSelected) {

    var port = new SerialPort(portSelected, {
        autoOpen: false,
        encoding: 'utf8',
        baudrate: 115200
    });

    port.open(function(err) {
        if (err) console.log('Error opening port: ', err.message);
    });

    port.on('data', function(data) {
        //console.log('Data: ' + data);

        var datosSerie = false;
        var time = new Date().getTime()
        console.log('Data:', time, data);
        try {
            datosSerie = JSON.parse(data);
            console.log(time, "[DATA]", datosSerie);
        } catch (e) {
            console.log(time, "[DATA] Not ready to send");
        }

        if (datosSerie) {
            myFirebaseRef.set(datosSerie, function(error) {
                if (error) {
                    console.log('[FIREBASE] ERROR - Sincronización fallida');
                }
            });
        }

    });

} else {

    SerialPort.list(function(err, ports) {
        ports.forEach(function(port) {
            console.log("comName:", port.comName);
        });
    });

}