import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {use, useEffect, useState} from 'react';
import {Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-date-picker';
import {ScrollView} from 'react-native';
import {useRoute, RouteProp} from '@react-navigation/native';
import axios from 'axios';
import BASE_URL from '../components/BASE_URL';
import Toast from 'react-native-toast-message'; // Make sure to import Toast
import {BackHandler} from 'react-native';

type UpdateDonationRouteParams = {
  donationData: any;
};

interface DonTypes {
  _id: string;
  dontype: string;
}

interface UpdateForm {
  amount: string;
  remarks: string;
  paymentMode: string;
  date: Date;
}

const UpdateDonation = ({navigation}: any) => {
  const route =
    useRoute<RouteProp<{params: UpdateDonationRouteParams}, 'params'>>();
  const {donationData} = route.params;
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(donationData?.donationType?._id || null);
  const [dateOpen, setDateOpen] = useState(false);
  const [updateForm, setUpdateForm] = useState<UpdateForm>({
    amount: donationData.amount.toString(),
    date: new Date(donationData.date),
    paymentMode: donationData.paymentMode,
    remarks: donationData.remarks || '',
  });
  const [showSignOut, setShowSignOut] = useState(false);

  const onChangeText = (field: keyof UpdateForm, value: string | Date) => {
    setUpdateForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const [allDonType, setAllDonType] = useState<DonTypes[]>([]);
  const transformedDonType = allDonType.map(type => ({
    label: type.dontype,
    value: type._id,
  }));

  // Get Donations Type
  const getAllDonType = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/donType/getAllDonType`);
      setAllDonType(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllDonType();
  }, []);

  // Handle donation update
  const handleUpdate = async () => {
    if (!updateForm.amount || isNaN(Number(updateForm.amount))) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please enter a valid amount.',
        visibilityTime: 1500,
      });
      return;
    }
    if (!updateForm.paymentMode.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please enter payment mode.',
        visibilityTime: 1500,
      });
      return;
    }
    if (!value) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please select a donation type.',
        visibilityTime: 1500,
      });
      return;
    }
    if (!updateForm.date || isNaN(updateForm.date.getTime())) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please select a valid date.',
        visibilityTime: 1500,
      });
      return;
    }

    if (updateForm.date > new Date()) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Donation date cannot be in the future.',
        visibilityTime: 1500,
      });
      return;
    }

    try {
      const res = await axios.put(
        `${BASE_URL}/Donation/updateDonation/${donationData._id}`,
        {
          donorId: donationData._id,
          amount: Number(updateForm.amount),
          paymentMode: updateForm.paymentMode,
          donationType: value,
          date: updateForm.date.toISOString(),
          remarks: updateForm.date,
        },
      );

      if (res.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Donation updated successfully!',
          visibilityTime: 1500,
        });
        navigation.navigate('Donations');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update donation',
        visibilityTime: 1500,
      });
      console.log(error);
    }
  };

  useEffect(() => {
    // Handle Back Press
    const handleBack = () => {
      navigation.navigate('Donations');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBack,
    );

    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBarContainer}>
        <Image
          source={require('../assets/logo-black.png')}
          style={{width: 100, height: 100}}
          tintColor={'#fff'}
          resizeMode="contain"
        />

        <View style={{position: 'relative'}}>
          <TouchableOpacity onPress={() => setShowSignOut(prev => !prev)}>
            <Icon name="account-circle" size={45} color="#fff" />
          </TouchableOpacity>
          {showSignOut && (
            <View
              style={{
                position: 'absolute',
                top: 50,
                right: 0,
                backgroundColor: '#fff',
                borderRadius: 10,
                elevation: 8,
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.15,
                shadowRadius: 8,
                paddingVertical: 8,
                minWidth: 140,
                alignItems: 'flex-start',
                zIndex: 9999,
              }}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  width: '100%',
                }}
                onPress={() => {
                  setShowSignOut(false);
                  navigation.replace('Login');
                }}>
                <Icon
                  name="logout"
                  size={22}
                  color="#6E11B0"
                  style={{marginRight: 10}}
                />
                <Text
                  style={{color: '#6E11B0', fontWeight: '600', fontSize: 15}}>
                  Sign Out
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <ScrollView>
        <View
          style={{
            flex: 1,
            padding: 20,
          }}>
          <View style={styles.receiveDonContainer}>
            <Text style={styles.sectionTitle}>Update Donation</Text>

            {/* Input Fields - Non-editable donor info */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.textInput, styles.disabledInput]}
                placeholder="Donor Name"
                placeholderTextColor={'#666'}
                value={donationData.donor.name}
                editable={false}
              />
              <TextInput
                style={[styles.textInput, styles.disabledInput]}
                placeholder="Contact"
                placeholderTextColor={'#666'}
                value={donationData.donor.contact}
                editable={false}
              />
              <TextInput
                style={[styles.textInput, styles.disabledInput]}
                placeholder="Address"
                placeholderTextColor={'#666'}
                value={donationData.donor.address}
                editable={false}
              />
              <TextInput
                style={[styles.textInput, styles.disabledInput]}
                placeholder="Union Council"
                placeholderTextColor={'#666'}
                value={donationData?.donor?.ucId?.uname || ''}
                editable={false}
              />
              <TextInput
                style={[styles.textInput, styles.disabledInput]}
                placeholder="District"
                placeholderTextColor={'#666'}
                value={donationData?.donor?.districtId?.district || ''}
                editable={false}
              />
              <TextInput
                style={[styles.textInput, styles.disabledInput]}
                placeholder="Zone"
                placeholderTextColor={'#666'}
                value={donationData?.donor?.zoneId?.zname || ''}
                editable={false}
              />

              {/* Editable Amount */}
              <TextInput
                style={styles.textInput}
                placeholder="Amount"
                value={updateForm.amount}
                onChangeText={t => onChangeText('amount', t)}
                placeholderTextColor={'#666'}
                keyboardType="numeric"
              />

              {/* Editable Payment Mode */}
              <TextInput
                style={styles.textInput}
                placeholder="Payment Mode"
                placeholderTextColor={'#666'}
                value={updateForm.paymentMode}
                onChangeText={t => onChangeText('paymentMode', t)}
              />
            </View>

            {/* DropDown - Editable Donation Type */}
            <View style={styles.dropDownContainer}>
              <DropDownPicker
                open={open}
                value={value}
                items={transformedDonType}
                setOpen={setOpen}
                setValue={setValue}
                placeholder="Select Type"
                placeholderStyle={{
                  color: '#888',
                  fontSize: 16,
                }}
                ArrowUpIconComponent={() => (
                  <Icon name="chevron-up" size={25} color="#6E11B0" />
                )}
                ArrowDownIconComponent={() => (
                  <Icon name="chevron-down" size={25} color="#6E11B0" />
                )}
                style={styles.dropDown}
                textStyle={{
                  fontSize: 14,
                  color: '#222',
                }}
                labelProps={{
                  numberOfLines: 1,
                  ellipsizeMode: 'tail',
                }}
                dropDownContainerStyle={{
                  borderRadius: 12,
                  maxHeight: 200,
                }}
                listItemContainerStyle={{
                  height: 45,
                }}
                listItemLabelStyle={{
                  fontSize: 16,
                  color: '#222',
                  overflow: 'hidden',
                }}
                listMode="SCROLLVIEW"
              />
            </View>

            {/* Input Fields - Editable Remarks */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Remarks"
                placeholderTextColor={'#666'}
                value={updateForm.remarks}
                onChangeText={t => onChangeText('remarks', t)}
                multiline
              />
            </View>

            {/* Editable Date Picker */}
            <TouchableOpacity
              style={[
                styles.textInput,
                {
                  width: '95%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: 'rgba(245, 245, 245, 0.2)',
                },
              ]}
              onPress={() => setDateOpen(true)}
              activeOpacity={0.8}>
              <Text style={{color: '#222', fontSize: 14}}>
                {updateForm.date.toLocaleDateString()}
              </Text>
              <Icon name="calendar" size={22} color="#6E11B0" />
              <DatePicker
                modal
                open={dateOpen}
                mode="date"
                date={updateForm.date}
                onConfirm={date => {
                  setDateOpen(false);
                  onChangeText('date', date);
                }}
                onCancel={() => {
                  setDateOpen(false);
                }}
              />
            </TouchableOpacity>

            {/* Update Button */}
            <TouchableOpacity style={styles.updateBtn} onPress={handleUpdate}>
              <Text style={styles.updateBtnText}>Update Donation</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default UpdateDonation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F6FB',
  },
  topBarContainer: {
    height: '10%',
    width: '100%',
    backgroundColor: '#6E11B0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '5%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#6E11B0',
    marginBottom: 20,
  },
  receiveDonContainer: {
    paddingVertical: '5%',
    paddingHorizontal: '5%',
    backgroundColor: '#fff',
    borderRadius: 16,
  },
  textInput: {
    backgroundColor: 'rgba(245, 245, 245, 0.2)',
    borderRadius: 8,
    borderColor: '#888',
    borderWidth: 0.6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#222',
    width: '95%',
    height: 45,
    alignSelf: 'center',
    marginBottom: 15,
  },
  disabledInput: {
    backgroundColor: '#f0f0f0',
    color: '#888',
  },
  inputContainer: {
    width: '100%',
  },
  dropDownContainer: {
    width: '95%',
    alignSelf: 'center',
    marginBottom: 15,
  },
  dropDown: {
    backgroundColor: 'rgba(245, 245, 245, 0.2)',
    borderColor: '#888',
    borderWidth: 0.6,
    borderRadius: 8,
  },
  updateBtn: {
    width: '95%',
    alignSelf: 'center',
    marginTop: 15,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#6E11B0',
    marginBottom: 15,
    alignItems: 'center',
  },
  updateBtnText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '700',
  },
});
