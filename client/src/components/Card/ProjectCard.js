import React, { useState, useRef } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import classes from './ProjectCards.module.css'
import useUser from '../useUser';
import useToken from '../useToken';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function ProjectCard(props) {

    const { user } = useUser();
    const { token } = useToken();

    const [expanded, setExpanded] = useState(false);
    const [expandedSetting, setExpandedSetting] = useState(false);

    const money = useRef("")

    const handleProjFundUpdate = (e) => {
      // if(money){
      // console.log(e.target, parseInt(money.current.value))
      // }
      if (money){
        const url = `http://localhost:8000/project/update/${props.project._key}`
        console.log(url)
        const reqBody = {
          // "project_name": props.project.project_name,
          // "github_repo": "string",
          // "description": "string",
          // "short_desc": "string",
          // "utc_date_created": "2022-07-06T01:53:51.008Z",
          // "icon_path": "string",
          // "stars": 2,
          "funds": parseInt(money.current.value) + parseInt(props.project.funds)
        }
  
        fetch(url, {
          method: 'PUT',
          headers: new Headers({
            'Authorization': `Bearer ${token}`,      
            'Accept': 'application/json',
            'Content-Type':'application/json'  
          }),
          body: JSON.stringify(reqBody)
        })
        .then(res => res.json())
        .then(data => {
          props.setFund(data.funds)
        })
      }
    }

    // const handleFavorite = () => {

    //   props.setFavorite(!props.favorite);
    // };

    const handleExpandClick = () => {
      setExpanded(!expanded);
    };

    const handleExpandSetting = (e) => {
    const pro_key = e.target.offsetParent.parentElement.id
    handleAddMember(pro_key, user)

      setExpandedSetting(!expandedSetting);
    };

    const handleFund = () => {
        if(money){
            props.setFund(props.fund + parseInt(money.current.value))
        }
    };

    const handleAddMember = (project_key, user) => {

      console.log(project_key, user, token, "<-------------- Add Member")

      const member_info = {
        "project_key": project_key,
        "username": [
          user
        ],
        "role": "Member"
      }

      const url = `http://localhost:8000/project/members/add`
    
          fetch(url, {
            method: 'POST',
            headers: new Headers({
              'Authorization': `Bearer ${token.access_token}`,      
              'Accept': 'application/json',
              'Content-Type':'application/json'  
            }),
            body: JSON.stringify(member_info)
          })
          .then(res => res.json())
    }

  return (
    <Card sx={{ maxWidth: 345 }} id={props.project._key}>
        {
        (expandedSetting && (token && user)) &&
        <>
        <span className={classes.expandedSettingSpanOver}></span>
        <span className={classes.expandedSettingSpan}></span>
        <div className={classes.expandedSetting}>
          <ul>
            <li onClick={handleExpandSetting}>Add Member</li>
            <li onClick={handleExpandSetting}>Update</li>
            <li onClick={handleExpandSetting}>Delete</li>
          </ul>
        </div>
        </>
      }
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            {props.project.project_name.charAt(0)}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings" onClick={() => setExpandedSetting(!expandedSetting)}>
            <MoreVertIcon />
          </IconButton>
        }
        title={props.project.project_name}
        subheader={props.project.created_date}
      />
      <CardMedia
        component="img"
        height="194"
        image={props.project.icon_path}
        alt={props.project.project_name + "image"}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {props.project.short_desc}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        {
        props.project.funds &&
        `$ ${props.project.funds.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
        }
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
          
        </ExpandMore>
      </CardActions>
        <CardActions sx={{ display: 'flex', justifyContent: 'space-between'}}>
          <Box aria-label="fund">
            <TextField inputRef={money} id="outlined-basic" label="Fund Project" variant="outlined" disabled/>
          </Box>
          <Box aria-label="fund-btn">
            <Button sx={{ height: '4em' }} onClick={handleProjFundUpdate} variant="contained" color="success" disabled>Fund</Button>
          </Box>
        </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Description:</Typography>
          <Typography paragraph>
            {props.project.description}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}
