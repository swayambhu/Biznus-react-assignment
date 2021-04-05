import React, { useEffect} from 'react'
import TopBar from '../components/TopBar'
import Banner from '../components/Banner'
import Footer from  '../components/Footer'
import {useState} from 'react'
import { addToCart,updateCart } from '../../Action/action'
import {useDispatch} from 'react-redux'
import style from './ProductDetailDisplay.module.css'
import {useSelector} from 'react-redux'
import {donateObjData} from '../Donate/donateObjData'
import { toggleCartDisplay } from '../../Action/action'
import Announcement from '../components/Announcement'

const ProductDetailDisplay = React.memo(({item}) => {
    const preview=item.preview
    const cart = useSelector(state => state.cartProducts)
    const dispatch = useDispatch()
    const inputRef = React.createRef()
    const [previewImage, setPreviewImg]  = useState([])
    const [activeObject, setActiveObject] = useState()
    const [addToCartLoader, setAddToCartLoader] = useState(false)
    const photos = item.photos
    const dispatchAddToCart = () =>{
        let inputCount = inputRef.current.value
        inputCount = parseInt(inputCount)
        isNaN(inputCount) ? inputCount = 1  : inputCount = parseInt(inputCount)
        const itemFromCart  = cart?.find(product => product.id  === item.id )
        itemFromCart ? dispatch(updateCart(item,inputCount)) : dispatch(addToCart(item,inputCount))
    }
    //lifycycle method to laod response from API request being called in the middleware
    useEffect(()=>{
        setPreviewImg(preview)
        photos && setActiveObject(photos[0])
        // eslint-disable-next-line react-hooks/exhaustive-deps
     },[item])

     //toggle events for state 
    const toggleActiveObject = (item,index) =>{
        changePreview(item)
        setActiveObject(photos[index])
    }

    const toggleStyles = (item) =>{
        return item === activeObject ?  style["Active"] : "inactive"
    }

    const changePreview = (url) =>{
        setPreviewImg(url)
    }

    const addingToCartLoader = () =>{
        setAddToCartLoader(true)
        setTimeout(() => setAddToCartLoader(false),300)
    }
    
    return (
        <div className={style.ProductDetailSection}>
            <div className={style.Container}>
                <div className={style.ProductImage}>
                    <img src={previewImage} alt={item.name}/>
                </div>
                <div className={style.ProductDescription}>
                    <h2>{item.name}</h2>
                    <p className={style.Price}>{`Rs. ${item.price}`}</p>
                    <p>Quantity</p>
                    <div className={style.Quantity}>
                        <input ref={inputRef} type="number" max="100" min="1" placeholder="1"></input>
                        <button onClick={() => {dispatchAddToCart(); dispatch(toggleCartDisplay()); addingToCartLoader()}}>{addToCartLoader ? "Adding To Cart ..." : "Add To Cart"}</button>
                    </div>
                    <div className={style.TextDesc}>
                        <h3>Description</h3>
                        <p className={style.DescParah}>{item.description}</p>
                    </div>
                    <div className={style.ProductPreview}>
                        <h3>Product Preview</h3>
                        <div style={{display:"flex"}}>
                            {photos?.map((item,index) =>  <img  className={toggleStyles(item)} key = {index} onClick = {()=> toggleActiveObject(item,index)} src={item} alt={item.name}/>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
})

const ProductDetail = ({match}) => {
    const {id}  = match.params
    const idType  = isNaN(Number(id)) ? "donationID"  : "productID"
    //checking for the id thats being passed in the url if it is a call to product or donation
    const [item, setItem] = useState({
        photos: []
    }) 
    
    const fetchDonateItem =() =>{
        const tempItem = donateObjData.find(item => item.price === parseInt(id.split('-').[1]))
        setItem(tempItem)
    }
    //fetching the data array based on from where this child component is being called(either  from shop page to display products or from donate page to display dontations)
    useEffect(()=>{
        idType === "productID" && fetchItem()
        idType === "donationID" && fetchDonateItem()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const fetchItem = async() =>{
        const fetchItem = await fetch(`https://5d76bf96515d1a0014085cf9.mockapi.io/product/${id}`)
        const tempItem = await fetchItem.json()
        await setItem(tempItem)
    }
    return ( 
        <>
            <Announcement/>
            <TopBar />
            <Banner data = {{heading:item.name}} className = "ShopBanner"/>
            <ProductDetailDisplay item={item}/>
            <Footer />
        </>
     );
}
 
export default ProductDetail;