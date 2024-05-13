import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, ImageBackground, Button, Pressable } from 'react-native';

import { Audio } from 'expo-av';
import React, { useState, useEffect, Component, startTransition, Suspense } from 'react';


class LazyComponent extends Component {

  constructor(props) {
    super(props);

    this.state = {
      radio_stream: "not ready",
      disable_play: false,
      disable_pause: true
    };
  }

  async componentDidMount() {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: 2,
      playsInSilentModeIOS: true,
      interruptionModeAndroid: 2,
      shouldDuckAndroid: true,
      staysActiveInBackground:true,
      playThroughEarpieceAndroid: true
    });

    const status = {
      shouldPlay: false,
      isLooping: false,
      progressUpdateIntervalMillis: 10
    };

    this.sound_obj = await Audio.Sound.createAsync(
      { uri: 'https://n03.radiojar.com/8s5u5tpdtwzuv' },
      status
    );

    if (this.sound_obj) {
      this.setState({ radio_stream: "ready" });
    }

  }

  async playSound(ev) {

    if (this.state.disable_play === true) {
      console.log("cancel play");
    }
    else {
      if (this.sound_obj.status.isLoaded) {
        console.log("play pressed");
        await this.sound_obj.sound.playAsync();

        this.setState({ disable_play: true });
        this.setState({ disable_pause: false });
      }
    }
     
  }

  pauseSound() {
    if (this.state.disable_pause === true) {
      console.log("cancel pause");
    }
    else {
      console.log("will pause");

      this.sound_obj.sound.pauseAsync();

      this.setState({ disable_play: false });
      this.setState({ disable_pause: true });
    }
  }

  
  render() {
    return (
      <View style={{ top: 20 }}>

        <View style={styles.content} >{(this.state.radio_stream === "not ready")? <Text>جارٍ تهيئة محطة الراديو، يرجى الانتظار...</Text>: null}</View>
        <View style={styles.content} >{(this.state.radio_stream === "not ready")? <Text>Initializing Radio Stream, please wait...</Text>: null}</View>
        <View style={styles.content} >{(this.state.radio_stream === "ready" && this.state.disable_play === false)? <Pressable style={styles.btnSound} onPress={ () => this.playSound() } ><Text style={styles.btnText} >Play</Text></Pressable>: null}</View>
        <View style={styles.content} >{(this.state.radio_stream === "ready" && this.state.disable_pause === false)? <Pressable style={styles.btnSound} onPress={() => this.pauseSound()} ><Text style={styles.btnText} >Pause</Text></Pressable>: null}</View>
        
      </View>
    );
  }
}

export default class App extends Component {

  render() {
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.heading}>إذاعة القرآن الكريم من القاهرة</Text>
        </View>
        <View>
          <Text style={styles.heading} >Holly Quarn Radio Station from Cairo</Text>
        </View>
        <View >
          <LazyComponent />  
          <Image source={require('./assets/mosque.jpg')} style={styles.image} resizeMode='contain'/>
        </View>
        <View style={{ flexDirection: 'row', alignSelf: 'stretch', justifyContent: 'space-around' }}>
          
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e4d1c0',
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 300,
    height: 480,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: 'row', 
    alignSelf: 'stretch', 
    justifyContent: 'space-around',
  },
  heading: {
    position: "relative",
    fontWeight: 'bold',
    fontSize: 18,
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  content: {
    flexDirection: 'row', 
    alignSelf: 'stretch', 
    justifyContent: 'space-around',
  },
  btnSound: {
    width: 300,
    height:50, 
    backgroundColor:"#A1750D",
    flexDirection: 'row', 
    alignSelf: 'stretch', 
    justifyContent: 'space-around',
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: 'row', 
    alignSelf: 'stretch', 
    justifyContent: 'space-around',
    fontWeight: 'bold',
    fontSize: 30,
    color: "#FFFFFF"
  }
});
