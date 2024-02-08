import { NetInfoStateType } from '@react-native-community/netinfo';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, Button, TextInput, StyleSheet, Alert, FlatList, Text } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { dataSyncAPI } from './Api';
import { MMKV } from 'react-native-mmkv';


const Home = () => {
    const [noteText, setNoteText] = useState('');
    const [notes, setNotes] = useState<string[]>([]);
    const storage = new MMKV();


    const handleAddNote = () => {
        if (noteText.length > 0) {
            setNotes([...notes, noteText]);
            storage.set('notes', JSON.stringify(notes)); // Convert notes array to string
            setNoteText('');
        } else {
            Alert.alert('Note is empty', 'Please add a note');
        }
    };


    useEffect(() => {
        const notes = JSON.parse(storage.getString('notes') || '[]');
        setNotes(notes);

        const state = NetInfo.addEventListener(state => {
            if (state.type === NetInfoStateType.none) {
                console.log('No Internet', 'Please check your internet connection');
            } else {
                dataSyncAPI();
                console.log('Connected', 'You are connected to the internet');
            }

        })

        const intervalId = setInterval(() => {
            state();
        }, 1000);

        return () => {
            state();
            clearInterval(intervalId);
        };
    }, []);

    return (
        <SafeAreaView>
            <TextInput
                style={styles.input}
                onChangeText={setNoteText}
                value={noteText}
                placeholder="Note"
            />
            <Button title="Add note" onPress={handleAddNote} />

            <FlatList
                data={notes}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    item: {
        padding: 10,
        fontSize: 18,
    },
});

export default Home;