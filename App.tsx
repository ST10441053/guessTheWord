import { useState } from 'react';
import { StyleSheet, Text, View,TouchableHighlight } from 'react-native';

const ALPHABET= 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export default function App() {
  const [word,setWord] = useState<string>('');
  const [displayWord, setDisplayWord] = useState<string>('');
  const [usedLetters, setUsedLetters] = useState<string[]>([]);
  const [remainningGuesses, setRemainingGuesses] = useState<number>(6);

  const fetchRendomWord = async () => { // retrieve the word from the API
    try {
      const response = await fetch('https://random-word-api.herokuapp.com/word?number=1');
      const data = await response.json();
      setWord(data[0].toUpperCase());
      setDisplayWord('_ '.repeat(data[0].length))
      setUsedLetters([]);
      setRemainingGuesses(6);
    }catch (error)
    {
      console.error('Error fecthing random word:', error);
    }
  };
  const rendeAlphabetButton = () => { // display the letter
    return [...ALPHABET].map((letter)=> (
      <TouchableHighlight
      key={letter}
      onPress={() =>handleLetterPress(letter)}
      disabled = {usedLetters.includes(letter) || remainningGuesses <= 0}
      >
        <Text>{letter}</Text>
      </TouchableHighlight>
    ));
  };

  const handleLetterPress = (letter: string) => {
    if(usedLetters.includes(letter) || remainningGuesses <= 0 )
      return;
    setUsedLetters([...usedLetters, letter]);
    if (word.includes(letter)){
      // upddate the dispalyed word
      const updatedDisplay = word.split('').map((char, index)=>
        usedLetters.includes(char) || char === letter ? char : '_ '
       ).join('');
       setDisplayWord(updatedDisplay);
    }else{
      // decrease the remaining guess if the letter is incorrect
      setRemainingGuesses(remainningGuesses - 1);
    }
    
  };
  return (
    <View style={styles.container}>
      <Text>{displayWord || 'Press "Start Game" to begin'}</Text>
      <Text>Remaing Guesses: {remainningGuesses}</Text>
      <TouchableHighlight onPress={fetchRendomWord}>
        <Text>Start Game</Text>
      </TouchableHighlight>
      <View>
        {rendeAlphabetButton()}
      </View>
      {remainningGuesses === 0 && <Text>Game over - the word was "{word}"</Text>}
      {displayWord === word && <Text>Congratulations - you won!</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
