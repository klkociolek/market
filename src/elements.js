import styled from 'styled-components';
import { NavLink as Link } from 'react-router-dom';

export const Nav = styled.nav`
  background: black;
  height: 85px;
  display: flex;
  justify-content: flex-start;
`;
  
export const NavLink = styled(Link)`
  color: white;
  display: flex;
  align-items: center;
  font-size: 30px;
  text-decoration: none;
  padding: 0 1rem;
  height: 10px;
  cursor: pointer;
  &.active {
    color: blue;
  }
`;

export const NavLinkPage = styled(Link)`
  color: black;
  border-radius: 25px 25px 25px 25px;
  background: #00BFFF;
  font-size: 30px;
  padding: 0.5rem 2rem;
  text-decoration: none;
  height: 10px;
  cursor: pointer;
  &.active {
    color: blue;
  }
`;

export const Connection = styled.button`
  color: white;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  height: 10px;
  cursor: pointer;
  &.active {
    color: blue;
  }
`;
  
export const NavMenuList = styled.div`
  display: flex;
  align-items: center;
  margin-left: 100px;
`;

export const NavMenuAcc = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
`;

export const NavMenuLogo = styled.div`
  display: flex;
  align-items: center;
  margin-left: 20px;
`;

export const Logo = styled.img`
  height: 50px;
  width: 50px;
`;

export const FormGroup = styled.div`
    display: block;
	width: 400px;
	margin: 50px auto;
`;

export const Block_img = styled.div`
    display: block;
    background: #282828;
    border-radius: 25px;
	  width: 300px;
    height: 420px;
`;

export const Block = styled.div`
    display: block;
    background: #282828;
    border-radius: 25px;
	  width: 300px;
    height: 450px;
    margin: 20px auto;
`;

export const Box = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-items: center;
`;

export const Title = styled.label`
	margin-bottom: 0.2em;
	color: white;
  display: block;
  font-size: 2em;
`;

export const Description = styled.label`
	margin-bottom: 0.5em;
	color: white;
    display: block;
`;

export const Price = styled.label`
	margin-bottom: 0.5em;
	color: white;
    display: block;
`;

export const Label = styled.label`
	margin-bottom: 0.5em;
	color: white;
    display: block;
`;


export const Image = styled.img`
  display: box;
  height: 300px;
  width: 300px;
  border-radius: 25px 25px 0px 0px;
`;

export const Input = styled.input`
	padding: 0.5em;
	color: black;
	background: white;
	border: none;
	border-radius: 3px;
	width: 100%;
`;

export const Button = styled.button`
  border-radius: 25px 25px 25px 25px;
  background: #00BFFF;
  font-size: 1em;
  padding: 0.2em 2em;
  margin: 5px;
`;
