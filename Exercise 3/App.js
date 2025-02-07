import React,{useState, useEffect} from 'react';
import {StatusBar, StyleSheet, Text, View, Image} from 'react-native';
import {Gyroscope} from "expo-sensors";
import {Audio} from "expo-av";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    text: {
        fontSize: 40,
        fontWeight: 'bold',
        color: 'black',
        alignItems: 'center',
    }
});

export default function App() {
    const [shake, setShake] = useState(false);
    const [mySound, setMySound] = useState();
    const [{x, y, z}, setData] = useState({x:0,y:0, z:0});

    useEffect(()=>{
        let lastShakeTime = 0;
        const threshold = 1.2;

        const subscription = Gyroscope.addListener(({ x, y, z }) => {
            const acceleration = Math.sqrt(x * x + y * y + z * z);
            const currentTime = Date.now();

            if (acceleration > threshold && currentTime - lastShakeTime > 500) {
                lastShakeTime = currentTime;
                setShake(true);
                playSound();
                setTimeout(() => setShake(false), 4000);
            }
        });

        return () => subscription.remove();
    }, [])

    async function playSound(){
        const soundfile = require('./un dos tres cuatro .mp3'); // Loads sound file
        const { sound } = await Audio.Sound.createAsync(soundfile); // Assign Variable
        setMySound(sound);
        await sound.playAsync();
    }

    useEffect(() => {
        return mySound
            ? () => {
                console.log('Unloading Sound');
                mySound.unloadAsync();
            }
            : undefined;
    }, [mySound]);

    return (
        <View style={styles.container}>
            <StatusBar />
            {shake && <Text style={styles.text}>UN</Text>}
            {shake && <Text style={styles.text}>DOS</Text>}
            {shake && <Text style={styles.text}>TRES</Text>}
            {shake && <Text style={styles.text}>CUATRO</Text>}
        </View>
    );
}
