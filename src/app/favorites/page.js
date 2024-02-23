'use client'

import { useState, useEffect } from 'react';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import DeleteForever from '@mui/icons-material/DeleteForever';
import AddBox from '@mui/icons-material/AddBox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { TextField } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

export default function favorites() {

    const [favorites, setfavorites] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newFavorite, setNewFavorite] = useState('');

    function inputChangeHandler(e) {
        setNewFavorite(e.target.value);
    }

    function addNewFavorite() {
        if(newFavorite && newFavorite.length) {
            fetch("/api/favorites", { method: "post", body: JSON.stringify({value: newFavorite, done: false}) } ).then((response) => {
                return response.json().then((newFavorite) => {
                    setfavorites([...favorites, newFavorite]);
                    setNewFavorite('');
                });
            });
        }
    }

    function removeFavorite({ index }) {
        const FavoriteItem = favorites[index];
        fetch(`/api/favorites/${FavoriteItem.id}`, { method: 'delete' }).then((res) => {
            if (res.ok) {
                setfavorites(favorites.filter((v,idx) => idx!==index));
            }
        });
    }

    function toggleDone({idx, item}) {
        let updatedItem = {...item, done: !item.done};
        fetch(`/api/favorites/${item.id}}`, {method: 'put', body: JSON.stringify(updatedItem)}).then((res) => {
            if(res.ok) {
                const updatedfavorites = [...favorites];
                updatedfavorites[idx] = updatedItem;
                setfavorites(updatedfavorites);
            }
        });
    }

    useEffect(() => {
        fetch("/api/favorites", { method: "get" }).then((response) => response.ok && response.json()).then(
            favorites => {
                favorites && setfavorites(favorites);
                setIsLoading(false);
            }
        );
    }, []);

    const loadingItems = <CircularProgress/>;

    const FavoriteItems = isLoading ? loadingItems : favorites.map((Favorite, idx) => {
        return <ListItem key={idx} secondaryAction={
            <IconButton edge="end" onClick={() => removeFavorite({index: idx})} aria-label='delete Favorite'><DeleteForever/></IconButton>   
        }>  
            <ListItemButton>
                <ListItemIcon>
                    <Checkbox checked={Favorite.done} disableRipple onChange={() => {
                        toggleDone({idx, item: Favorite})
                    }} aria-label="toggle done"/>
                </ListItemIcon>
                <ListItemText primary={Favorite.value}/>
            </ListItemButton>
        </ListItem>;
    });

    return (
        <>
            <h2>My favorites</h2>
            <List sx={{ width: '100%', maxWidth: 500 }}>
                { FavoriteItems }
                {!isLoading && <ListItem key="newItem" secondaryAction={<IconButton edge="end" onClick={addNewFavorite} aria-label="add button"><AddBox/></IconButton>}>
                    <TextField label="New Favorite Item" fullWidth variant="outlined" value={newFavorite} onChange={inputChangeHandler}/> 
                </ListItem>}
            </List>
        </>
    );
}