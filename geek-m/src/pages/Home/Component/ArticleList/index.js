import { getArticleList, getMoreArticleList } from '@/store/actions/home'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ArticleItem from '../ArticleItem'
import styles from './index.module.scss'
import { PullToRefresh, InfiniteScroll } from 'antd-mobile-v5'

/**
 * 文章列表组件
 * @param {String} props.channelId  当前文章列表所对应的id
 * @param {String} props.aid   当前tab栏中的频道id
 * @returns
 */
const ArticleList = ({ channelId, activeId }) => {
  const dispatch = useDispatch()
  const current = useSelector((state) => state.home.articles[channelId])
  //发请求可以在useEffect里面发,但是不能加async,因为加了之后就会返回一个promise
  useEffect(() => {
    //如果该频道有文章数据,没必要一进来就发送请求(优化)
    if (current) return
    if (channelId === activeId) {
      dispatch(getArticleList(channelId, Date.now))
    }
  }, [channelId, activeId, dispatch, current])
  const onRefresh = async () => {
    setHasMore(true)
    //下拉刷新需要加载最新的数据
    await dispatch(getArticleList(channelId, Date.now))
  }
  //是否有更多数据
  const [hasMore, setHasMore] = useState(true)
  //代表是否正在加载数据
  const [loading, setLoading] = useState(false)
  const loadMore = async () => {
    //如果正在加载中，不允许重复加载
    if (loading) return
    //如果不是当前频道，也不用加载
    if (channelId !== activeId) return
    // 如果没有timestamp，代表没有更多数据了
    if (!current.timestamp) {
      setHasMore(false)
      return
    }
    //正在加载
    setLoading(true)
    try {
      await dispatch(getMoreArticleList(channelId, current.timestamp))
    } finally {
      setLoading(false)
    }

    // setLoading(true)
    // console.log(current, 'current')
    // try {
    //   setHasMore(true)
    //   await dispatch(getArticleList(channelId, current.timestamp))
    // } finally {
    //   setLoading(false)
    // }
  }
  //如果不是当前频道,没有文章数据,先不渲染(优化)
  if (!current) return null
  return (
    <div className={styles.root}>
      <PullToRefresh onRefresh={onRefresh}>
        <div className="articles">
          {current.list.map((item) => (
            <div className="article-item" key={item.art_id}>
              <ArticleItem channelId={channelId} article={item}></ArticleItem>
            </div>
          ))}
        </div>
      </PullToRefresh>

      {/* 上拉加载更多 */}
      <InfiniteScroll loadMore={loadMore} hasMore={hasMore}></InfiniteScroll>
    </div>
  )
}

export default ArticleList
