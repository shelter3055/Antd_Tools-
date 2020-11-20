import React,{Component} from 'react'
import { Tree } from 'antd';
import Mask from 'comp/Mask.js'
import  './App.less'
import {
  PlusOutlined,
} from '@ant-design/icons';
const x = 3;
const y = 2;
const z = 1;
const gData = [];

const generateData = (_level, _preKey, _tns) => {
  const preKey = _preKey || '0';
  const tns = _tns || gData;

  const children = [];
  for (let i = 0; i < x; i++) {
    const key = `${preKey}-${i}`;
    tns.push({ title: key, key });
    if (i < y) {
      children.push(key);
    }
  }
  if (_level < 0) {
    return tns;
  }
  const level = _level - 1;
  children.forEach((key, index) => {
    tns[index].children = [];
    return generateData(level, key, tns[index].children);
  });
};
generateData(z);

export default class App extends Component {
  state = {
    gData,
    expandedKeys: ['0-0', '0-0-0', '0-0-0-0'],
    flag:false,
    old:''
  };

  onDragEnter = info => {
    console.log(info);
    // expandedKeys 需要受控时设置
    // this.setState({
    //   expandedKeys: info.expandedKeys,
    // });
  };

  onDrop = info => {
    console.log(info);
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    const dropPos = info.node.props.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (data, key, callback) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
           loop(data[i].children, key, callback);
        }
      }
    };
    const data = [...this.state.gData];

    // Find dragObject
    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, item => {
        item.children = item.children || [];
        // where to insert 示例添加到尾部，可以是随意位置
        item.children.push(dragObj);
      });
    } else if (
      (info.node.props.children || []).length > 0 && // Has children
      info.node.props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, item => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
      });
    } else {
      let ar;
      let i;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    }

    this.setState({
      gData: data,
    });
  };
  change=({node:{title}})=>{
    // console.log(node);
    this.setState({
      flag:true,
      old:title,
    })
  }
  closeflag=(e)=>{
    if(e.target.dataset.type === 'mask'){
      this.setState({
        flag:false
      })
    }
  }
  savaData=(data)=>{
    const {old} = this.state
    function save(arr){
      arr.map(item=>{
        if(item.title===old){
          item.title = data
        }else{
          if(item.children){
            save(item.children)
          }
        }
      return item
      })
    }
    save(gData)
  }
  add=(selectedKeys, {node,node:{children,title}})=>{
    // console.log(node);
    let num = 0
      function addNode(arr){
        arr.map(item=>{
          if(item.title===title){
            if(item.children){
              let head = children.slice(-1)[0]['title'].slice(0,-2)
              let str = children.slice(-1)[0]['title'].slice(-1)
              num = ++str
              let addTitle = `${head}-${num}`
              const obj = {
                title:addTitle,
                key:addTitle
              }
              item.children.push(obj)
            }else{
              console.log(1);
              item.children = []
              console.log(item);
              let Title = `${title}-${num}`
              const obj = {
                title:Title,
                key:Title
              }
              item.children.push(obj)
              console.log(item);
            }
          }else{
            if(item.children){
              addNode(item.children)
            }
          }
          return item
        })
      }
      addNode(gData)
      this.setState({
        gData:JSON.parse(JSON.stringify(gData))
      })
  }
  delete = (selectedKeys, {node,node:{title}})=>{
    console.log(node);
    function deleteNode(arr){
      arr.map((item,index)=>{
        if(item.title === title){
          console.log(index);
          arr.splice(index,1)
        }else{
          if(item.children){
            deleteNode(item.children)
          }
        }
        return item
      })
    }
    deleteNode(gData)
    this.setState({
      gData:JSON.parse(JSON.stringify(gData))
    })
  }
  render() {
    const {flag,old} = this.state
    return (
      <div id='root'>
        <Tree
          className="draggable-tree"
          icon={<PlusOutlined/>}
          showIcon = 'true'
          defaultExpandedKeys={this.state.expandedKeys}
          draggable
          blockNode
          onDragEnter={this.onDragEnter}
          onDrop={this.onDrop}
          treeData={this.state.gData}
          onRightClick={this.change}
          onSelect={this.delete}
        />
        {flag && <Mask
        closeflag={this.closeflag}
        old={old}
        savaData = {this.savaData}
        />}
      </div>
    );
  }
}