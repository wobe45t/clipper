import {useRecoilState, useSetRecoilState, useRecoilValue} from 'recoil';
import {useFetchWrapper} from '../core';
import {tagAtom, userAtom} from '../state';

export const useGetTags = () => {
  const user = useRecoilValue(userAtom);
  const setTags = useSetRecoilState(tagAtom);
  const fetchWrapper = useFetchWrapper();
  return async () => {
    try {
      const {data} = await fetchWrapper.get(`/tags/${user.id}`);
      setTags(data);
    } catch (err) {
      console.error(err);
      // TagState.set({success: false, message: err.response.data.detail});
    }
  };
};

export const useAddTag = () => {
  const user = useRecoilValue(userAtom);
  const [tags, setTags] = useRecoilState(tagAtom);
  const fetchWrapper = useFetchWrapper();
  return async tag => {
    try {
      const {data} = await fetchWrapper.post(`/tags/${user.id}`, tag);
      if (data) {
        setTags([...tags, data]);
      }
    } catch (err) {
      console.error(err);
      // TagState.set(state => {
      //   let newState = {
      //     success: false,
      //     data: state.data,
      //     message: err.response.data.detail,
      //   };
      //   return newState;
      // });
    }
  };
};

export const useDeleteTag = () => {
  const fetchWrapper = useFetchWrapper();
  return async id => {
    try {
      const {status} = await fetchWrapper.delete(`/tags/${id}`);
      if (status == 200) {
        const tempTags = tags.filter(t => t.id != id);
        setTags(tempTags);
        // TagState.set(state => {
        //   let newState = state.data.filter(tag => tag.id != id);
        //   state.success.set(true);
        //   return newState;
        // });
      }
    } catch (err) {
      console.error(err);
      // TagState.set({success: false, message: err.response.data.detail});
    }
  };
};
