import React,{Component} from 'react'
import styles from 'assets/stylesheets/mask.less'
export default class Mask extends Component{
    constructor(props){
        super(props)
        this.state={
            val:this.props.old
        }
    }
    confirm=(e)=>{
        const {closeflag} = this.props
        const {val} = this.state
        const {savaData} = this.props
        savaData(val)
        closeflag(e)
    }
    change=(e)=>{
        this.setState({
            val:e.target.value
        })
    }
    render(){
        const {closeflag} = this.props
        const {val} = this.state
        return (
            <div data-type='mask' className={styles.mask} onClick={closeflag}>
                <div className={styles.container}>
                    <input className={styles.input} value={val} onChange={this.change}/>
                    <div className={styles.btn}>
                        <button data-type='mask' onClick={closeflag}>取消</button>
                        <button data-type='mask' onClick={this.confirm}>确定</button>
                    </div>
                </div>
            </div>
        )
    }
}