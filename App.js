import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  StatusBar, 
  Animated, 
  Easing
} from 'react-native';
import { WebView } from 'react-native-webview';

export default function App() {
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse animation for the logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1200,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.98,
          duration: 1200,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    ).start();

    // Rotation animation for a premium loader ring
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const handleLoadEnd = () => {
    // Smooth fade out of the splash overlay
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start(() => {
      setLoading(false);
    });
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent={true} backgroundColor="transparent" />
      <View style={styles.webviewWrapper}>
        <WebView 
          source={{ uri: 'https://alany.ru' }} 
          style={styles.webview}
          allowsBackForwardNavigationGestures={true}
          domStorageEnabled={true}
          javaScriptEnabled={true}
          scalesPageToFit={true}
          showsVerticalScrollIndicator={false}
          decelerationRate="normal"
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          onLoadEnd={handleLoadEnd}
        />
      </View>

      {loading && (
        <Animated.View style={[styles.loadingOverlay, { opacity: fadeAnim }]}>
          <View style={styles.logoContainer}>
            {/* Pulsing premium floral logo */}
            <Animated.Image 
              source={require('./assets/icon.png')}
              style={[
                styles.logo,
                { transform: [{ scale: pulseAnim }] }
              ]}
            />
            {/* Rotating premium loading ring under the logo */}
            <View style={styles.spinnerWrapper}>
              <Animated.View 
                style={[
                  styles.loadingRing,
                  { transform: [{ rotate: spin }] }
                ]}
              />
            </View>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020202',
  },
  webviewWrapper: {
    flex: 1,
  },
  webview: {
    flex: 1,
    backgroundColor: '#020202',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#020202',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 250,
    height: 250,
  },
  logo: {
    width: 170,
    height: 170,
    borderRadius: 85,
    resizeMode: 'contain',
  },
  spinnerWrapper: {
    position: 'absolute',
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingRing: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: 'transparent',
    borderTopColor: '#ff8ec5', // pink color matching the flowers!
    borderRightColor: '#5eead4', // teal/green color matching the leaves!
    opacity: 0.8,
  },
});
