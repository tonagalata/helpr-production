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
import classes from './ProjectCard.module.css'
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
  const [favorite, setFavorite] = useState(false);
  const [fund, setFund] = useState(props.project.money);

  const money = useRef("")


  const handleFavorite = () => {

    setFavorite(!favorite);
  };

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
          setFund(fund + parseInt(money.current.value))
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
        <IconButton aria-label="add to favorites" onClick={handleFavorite}>
          <FavoriteIcon sx={{ color: favorite ? '#ff0000' : '' }} />
        </IconButton>
        ${"100000".toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
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
            <TextField inputRef={money} id="outlined-basic" label="Fund Project" variant="outlined" />
          </Box>
          <Box aria-label="fund-btn">
            <Button onClick={handleFund} sx={{ height: '4em' }} variant="contained" color="success">Fund</Button>
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
