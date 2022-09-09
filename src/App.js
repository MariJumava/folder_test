import React, { useState } from "react";
import styled from "styled-components";
import { AiOutlineFile, AiOutlineFolder } from "react-icons/ai";
import data from "./data.json";

const StyledWrap = styled.div`
  margin: 30px;
`;
const StyledTree = styled.div`
  line-height: 1.5;
`;
const StyledFile = styled.div`
  padding-left: 20px;
  display: flex;
  align-items: center;
  span {
    margin-left: 5px;
  }
`;
const StyledFolder = styled.div`
  padding-left: 20px;

  .folder {
    display: flex;
    align-items: center;
    cursor: pointer;
    span {
      margin-left: 5px;
    }
  }
`;
const Collapsible = styled.div`
  height: ${p => (p.isOpen ? "0" : "auto")};
  overflow: hidden;
`;

const File = ({ name }) => {
  return (
    <StyledFile>
      <AiOutlineFile />
      <span>{name}</span>
    </StyledFile>
  );
};

const Folder = ({ name, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = e => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  return (
    <StyledFolder key={name}>
      <div key={name} className="folder" onClick={handleToggle}>
        <AiOutlineFolder />
        <span>{name}</span>
      </div>
      <Collapsible isOpen={isOpen}>
        {children?.map(x => {
          return x.type === "file" ? (
            <Tree.File key={x.name} name={x.name} />
          ) : (
            <Tree.Folder key={x.name} name={x.name} children={x.childrens} />
          )
            })}
      </Collapsible>
    </StyledFolder>
  );
};

const Tree = ({ children }) => {
  return <StyledTree>{children}</StyledTree>;
};

Tree.File = File;
Tree.Folder = Folder;

const buildThree = (mapArrayParse) => {
  const root = [];

  mapArrayParse.forEach((element) => {
    const obj = {
      type: element.name.startsWith("file") ? "file" : "folder",
      childrens: [],
    };

    if (element.name.includes("in")) {
      let nestedElement = element.name.split("in")
      
      obj.name= nestedElement[0].trim();
      obj.parent = nestedElement[1].trim();

      let existence = root.find(
        (r) => r.name === obj.name && r.parent === undefined,
      )
      if (existence) { 
        root[root.indexOf(existence)] = obj
      }
      else root.push(obj) 
    } else {
      obj.name = element.name.trim();
      root.push(obj)
    }
  });

  root.slice(1).forEach((el) => {
    if (el.parent !== undefined) {
      let parent = root.find((r) => r.name === el.parent)
      root[root.indexOf(parent)].childrens.push(el)
    }
  })
  return {name: "root", type:"folder", childrens: root.slice(1).filter(x => x.parent === undefined)}
};


export const App = () => {
  const rootFolder = buildThree(data);
  return (
    <StyledWrap>
      <Tree>
        <Tree.Folder 
          name={rootFolder.name} 
          children={rootFolder.childrens}>
        </Tree.Folder>
      </Tree>
    </StyledWrap>
  );
}