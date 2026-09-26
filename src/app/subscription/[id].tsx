import { Link, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const SubscriptionDetail = () => {
    const {id} = useLocalSearchParams<{id: string}>()
    return (
        <View>
            <Text>Detail Subscription {id} </Text> 
            <Link href="/(tabs)/Subscription">Go Back</Link>
        </View>
    );
}

const styles = StyleSheet.create({})

export default SubscriptionDetail;
