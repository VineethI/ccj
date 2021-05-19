import React from 'react'
import FiberManualRecord from '@material-ui/icons/FiberManualRecord'
import styled from 'styled-components'
import CreateIcon from '@material-ui/icons/Create'
import SidebarOption from './SidebarOption'
import ExpandMore from '@material-ui/icons/ExpandMore'
import AddIcon from '@material-ui/icons/Add'
import {useCollection} from 'react-firebase-hooks/firestore'
import { db } from '../firebase';

function Sidebar() {

    const [channels, loading, error] = useCollection(db.collection('rooms'))

    return (
        <SidebarContainer>
            <SidebarHeader>
                <SidebarInfo>
                    <h2>Vineeth I</h2>
                    <h3>
                        <FiberManualRecord/>
                        VIT
                    </h3>
                </SidebarInfo>
                <CreateIcon/>
            </SidebarHeader>
            <SidebarOption Icon={ExpandMore} title="Channels"/>
            <hr/>
            <SidebarOption Icon={AddIcon} addChannelOption title="Add Channel"/>
            {channels?.docs.map(doc => (
                <SidebarOption key={doc.id} id={doc.id} title={doc.data().name}/>
            ))}
        </SidebarContainer>
    )
}

export default Sidebar

const SidebarContainer = styled.div`
    background-color: var(--slack-color);
    color: white;
    flex: 0.3;
    border-top: 1px solid #49274b;
    max-width: 260px;
    margin-top: 60px;
    >hr {
        margin-top: 10px;
        margin-bottom: 10px;
        border: 1px solid #49274b;
    }
`

const SidebarHeader = styled.div`
    display: flex;
    border-bottom: 1px solid #49274b;
    padding: 13px;

    > .MuiSvgIcon-root {
        padding: 8px;
        color: #49274b;
        font-size: 18px;
        background-color: white;
        border-radius: 999px;
    }
`

const SidebarInfo = styled.div`
    flex: 1;
    
    >h2 {
        font-size: 15px;
        font-weight: 900;
        margin-bottom: 5px;
    }

    >h3 {
        display: flex;
        font-size: 13px;
        font-weight: 400;
        align-items: center;
    }

    >h3>.MuiSvgIcon-root {
        font-size: 14px;
        margin-top: 1px;
        margin-right: 2px;
        color: green
    }
`