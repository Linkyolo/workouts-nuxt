import dayjs from 'dayjs';
export const useFormatDate = (dateString: string) => {
	return dayjs(dateString).format("YYYY-MM-DD HH:mm:ss");

}
