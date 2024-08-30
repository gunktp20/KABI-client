import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Box } from '@mui/material';
import getAxiosErrorMessage from '../../utils/getAxiosErrorMessage';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

interface IUser {
    id: string
    email: string
    displayName: string
    color: string
}

interface IProp {
    selectedUsers: IUser[]
    handleAutocompleteChange: (event: React.SyntheticEvent, newValue: IUser[]) => void
}

export default function InviteMembers({ selectedUsers, handleAutocompleteChange }: IProp) {
    const axiosPrivate = useAxiosPrivate()
    const [users, setUsers] = useState<IUser[]>([])

    const getAllUsers = async () => {

        try {
            const { data } = await axiosPrivate.get("/user")
            console.log(data)
            setUsers(data)
        } catch (err) {
            const msg = getAxiosErrorMessage(err)
            console.log(msg)
        }
    }

    useEffect(() => {
        getAllUsers()
    }, [])

    return (
        <Autocomplete
            // disablePortal
            multiple
            id="combo-box-demo"
            options={users}
            sx={{ width: "100%" }}
            getOptionLabel={(option) => option.email || option.displayName}
            renderOption={(props, option) => {
                const { key, ...optionProps } = props;
                return (
                    <Box
                        key={key}
                        component="li"
                        sx={{ '& > img': { mr: 2, flexShrink: 0 }, gap: "10px" }}
                        {...optionProps}
                    >
                        <div className={`bg-primary-500 w-[25px] h-[25px] flex justify-center items-center rounded-full text-[12px] text-white`}>{option.displayName[0].toUpperCase()}</div>
                        <div className='flex flex-col gap-[1px]'>
                            <div className='text-[11.5px] font-semibold'>{option.displayName}</div>
                            <div className='text-[10px]'>{option.email}</div>
                        </div>
                        {/* {option.label} ({option.code}) +{option.phone} */}
                    </Box>
                );
            }}
            renderInput={(params) => <TextField {...params}
                size="small"
                InputLabelProps={{ style: { fontSize: "11.5px", marginTop: "0.7%" } }}
                label="Invite member" />}
            onChange={handleAutocompleteChange}
            value={selectedUsers}
        />
    );
}
