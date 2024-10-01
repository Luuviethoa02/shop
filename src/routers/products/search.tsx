import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { useEffect, useState } from "react"
import LayoutWapper from "@/components/warper/layout.wrapper"
import { useParams } from "react-router-dom"
import { colorSelects, LIMIT_PAE_PRODUCT_LIST } from "@/features/products/constants"
import SekeletonList from "@/features/products/components/sekeleton-list"
import { Button } from "@/components/ui/button"
import { useFetchProvinces } from "@/hooks/useProvinces"
import LoadingMain from "@/components/share/LoadingMain"
import { ProvincesCommonType } from "@/types/api"
import { ChevronDown, ChevronUp, Filter } from "lucide-react"
import { useGetTextSearch } from "@/features/search/api/search-by-text"
import Product from "@/features/products/components/product"
import { useCategories } from "@/features/categories/api/get-categories"
import { Category, Filters } from "@/types/client"



export const SearchRoute = () => {
    const params = useParams()
    const [page, setPage] = useState<number>(1)
    const [priceFrom, setPriceFrom] = useState('')
    const [priceTo, setPriceTo] = useState('')

    const [citis, setCities] = useState<{
        data: ProvincesCommonType[]
        status: 'little' | 'more'
    }>({
        data: [],
        status: 'little'
    })

    const [categories, setCategories] = useState<{
        data: Category[]
        status: 'little' | 'more'
    }>({
        data: [],
        status: 'little'
    })

    const dataProvinces = useFetchProvinces()

    useEffect(() => {
        if (dataProvinces?.data) {
            const newData = dataProvinces.data.filter((data) => data.full_name.startsWith('Th'))
            setCities({
                data: newData,
                status: 'little'
            })
        }
    }, [dataProvinces?.data])


    useEffect(() => {
        if (dataProvinces.data) {
            const newData = dataProvinces?.data?.filter((data) => data.full_name.startsWith('Th'))
            if (citis.status === 'more') {
                const newData2 = dataProvinces?.data?.filter((data) => !data.full_name.startsWith('Th'))
                setCities({
                    data: [...citis.data, ...newData2],
                    status: 'more'
                })
            } else {
                setCities({
                    data: newData,
                    status: 'little'
                })
                window.scrollTo(0, 0)
            }
        }

    }, [citis.status])

    const [filters, setFilters] = useState<Filters>({
        text: params.text || '',
        page: 1,
        limit: LIMIT_PAE_PRODUCT_LIST,
        categoris: [],
        minPrice: undefined,
        maxPrice: undefined,
        color: [],
        province: [],
        rating: 5,
        is_discount: false,
    });

    const search = useGetTextSearch(filters)

    const handleFilterChange = (checked: any, name: string, value: string) => {
        if (name === 'color') {
            const newColor = checked ? [...(filters.color || []), value] : (filters.color || []).filter((color) => color !== value)
            setFilters({
                ...filters,
                color: newColor
            })
            return
        }

        if (name === 'province') {
            const newProvince = checked ? [...(filters.province || []), value] : (filters.province || []).filter((province) => province !== value)
            setFilters({
                ...filters,
                province: newProvince
            })
            return
        }
    }

    const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'from' | 'to') => {
        const value = event.target.value
        console.log(value);

        if (/^\d*\.?\d*$/.test(value)) {
            if (type === 'from') {
                setPriceFrom(value)
            } else {
                setPriceTo(value)
            }
        }
    }

    useEffect(() => {
        search.refetch();
    }, [filters])

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <LayoutWapper size="small">
            <div className="grid grid-cols-[300px_1fr] gap-6 p-2">
                <div className="bg-background max-h-screen p-3 mb-7 overflow-y-auto rounded-lg border-r-2">
                    <div className="flex items-center gap-2 mb-4">
                        <Filter />
                        <h2 className="text-lg uppercase font-[550]">bộ lọc tìm kiếm</h2>
                    </div>
                    <div className="grid gap-6">
                        <div>
                            <h3 className="text-base font-medium mb-2">Màu sắc</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {colorSelects.map((color, index) => (
                                    <Label key={index} className="flex items-center gap-2 cursor-pointer">
                                        <Checkbox
                                            onCheckedChange={(checked) => handleFilterChange(checked, 'color', color)}
                                            name="color"
                                            value={color} />
                                        <span className="capitalize">{color}</span>
                                    </Label>))}


                            </div>
                        </div>
                        <div>
                            <h3 className="text-base font-medium mb-2 capitalize">khoảng giá</h3>
                            <div className="grid gap-2">
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="min-price" className="font-normal capitalize min-w-10">
                                        Từ
                                    </Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">đ</span>
                                        <Input
                                            type="text"
                                            id="price"
                                            placeholder="00.000"
                                            value={priceFrom}
                                            onChange={(e) => handlePriceChange(e, 'from')}
                                            className="pl-7"
                                        />
                                    </div>

                                </div>
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="max-price" className="font-normal min-w-10 capitalize">
                                        đến
                                    </Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">đ</span>
                                        <Input
                                            type="text"
                                            id="price"
                                            placeholder="00.000"
                                            value={priceTo}
                                            onChange={(e) => handlePriceChange(e, 'to')}
                                            className="pl-7"
                                        />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Button
                                        onClick={() => setFilters({
                                            ...filters,
                                            minPrice: (!priceFrom || priceFrom == '0') ? undefined : +priceFrom,
                                            maxPrice: (!priceTo || priceTo == '0') ? undefined : +priceTo
                                        })}
                                        variant={'destructive'} disabled={(!priceFrom) || (!priceTo) || (+priceFrom > +priceTo)} className="capitalize w-full">áp dụng</Button>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-base font-medium mb-2 capitalize">nơi bán</h3>
                            {dataProvinces.status === 'pending' && (
                                <>
                                    <LoadingMain />
                                </>
                            )}

                            <div className="space-y-2">
                                {citis.data.length > 0 && citis.data.map(data => (
                                    <div key={data.id} className="grid gap-2">
                                        <Label className="flex items-center gap-2 cursor-pointer">
                                            <Checkbox
                                                onCheckedChange={(checked) => handleFilterChange(checked, 'province', data.full_name)}
                                                name="province"
                                                value={data.full_name}
                                            />
                                            <span className="capitalize font-normal">{data.full_name}</span>
                                        </Label>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center pl-5 mt-2 p-1 cursor-pointer gap-1">
                                <p onClick={() => setCities({
                                    ...citis,
                                    status: citis.status === 'little' ? 'more' : 'little'
                                })} className="font-normal capitalize">
                                    {`${citis.status === 'little' ? ' Hiện Thêm' : 'ẩn bớt'}`}
                                </p>
                                {citis.status === 'little' && (<ChevronDown size={14} />)}

                                {citis.status === 'more' && (<ChevronUp size={14} />)}

                            </div>
                        </div>

                        <div>
                            <h3 className="text-base font-medium mb-2 capitalize">Đánh giá</h3>
                            <div
                                onClick={() => setFilters({
                                    ...filters,
                                    rating: 5
                                })}
                                className={`flex items-center cursor-pointer px-2 py-[4px] rounded gap-1 ${filters.rating === 5 && 'bg-slate-100'}`}>
                                {Array.from({ length: 5 }).map((i, j) => (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={
                                        j < 6 ? "#fde047" : "none"
                                    } stroke="currentColor" key={j
                                    } className="size-4">
                                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                                    </svg>
                                ))}
                            </div>
                            <div
                                onClick={() => setFilters({
                                    ...filters,
                                    rating: 4
                                })}
                                className={`${filters.rating === 4 && 'bg-slate-100'} flex items-center cursor-pointer px-2 py-[4px] gap-1 rounded`}>
                                {Array.from({ length: 5 }).map((i, j) => (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={
                                        j < 4 ? "#fde047" : "none"
                                    } stroke="currentColor" key={j
                                    } className="size-4">
                                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                                    </svg>
                                ))}
                                trở lên
                            </div>
                            <div
                                onClick={() => setFilters({
                                    ...filters,
                                    rating: 3
                                })}
                                className={`${filters.rating === 3 && 'bg-slate-100'} flex items-center cursor-pointer px-2 py-[4px] gap-1 rounded`}>
                                {Array.from({ length: 5 }).map((i, j) => (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={
                                        j < 3 ? "#fde047" : "none"
                                    } stroke="currentColor" key={j
                                    } className="size-4">
                                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                                    </svg>
                                ))}
                                trở lên
                            </div>
                            <div
                                onClick={() => setFilters({
                                    ...filters,
                                    rating: 2
                                })}
                                className={`${filters.rating === 2 && 'bg-slate-100'} flex items-center cursor-pointer px-2 py-[4px] gap-1 rounded`}>
                                {Array.from({ length: 5 }).map((i, j) => (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={
                                        j < 2 ? "#fde047" : "none"
                                    } stroke="currentColor" key={j
                                    } className="size-4">
                                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                                    </svg>
                                ))}
                                trở lên
                            </div>
                            <div
                                onClick={() => setFilters({
                                    ...filters,
                                    rating: 1
                                })}
                                className={`${filters.rating === 1 && 'bg-slate-100'} flex items-center cursor-pointer px-2 py-[4px] gap-1 rounded`}>
                                {Array.from({ length: 5 }).map((i, j) => (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={
                                        j < 1 ? "#fde047" : "none"
                                    } stroke="currentColor" key={j
                                    } className="size-4">
                                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                                    </svg>
                                ))}
                                trở lên
                            </div>
                        </div>
                        <div>
                            <h3 className="text-base font-medium mb-2 capitalize">giảm giá</h3>
                            <div className="grid gap-2">
                                <Label className="flex items-center gap-2 cursor-pointer">
                                    <Checkbox
                                        onCheckedChange={(checked) => setFilters({
                                            ...filters,
                                            is_discount: !!checked
                                        })}
                                    />
                                    <span className="capitalize">Sản phẩm đang giảm giá</span>
                                </Label>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="flex flex-wrap max-w-full">
                        {(search.isLoading || search.isRefetching) &&
                            Array.from({ length: 8 }).map((_, index) => (
                                <SekeletonList key={index} />
                            ))}

                        {search?.data?.data && search.data?.data?.length === 0 && (
                            <div className="w-full text-center py-10">
                                <h2 className="text-2xl font-semibold">Không tìm thấy sản phẩm</h2>
                            </div>
                        )}

                        {search?.data?.data && search?.data?.data?.map((product) => (
                            <Product key={product?._id} product={product} />
                        ))}
                    </div>

                    {((Math.floor((search.data?.total ?? 0) / (search.data?.limit ?? 1))) > 0) && (
                        <div className="mt-10">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            className={
                                                page <= 1
                                                    ? "pointer-events-none opacity-50"
                                                    : "cursor-pointer"
                                            }
                                            onClick={() => setPage(page - 1)}
                                        />
                                    </PaginationItem>
                                    {Array.from({
                                        length: Math.ceil(search?.data?.total! / LIMIT_PAE_PRODUCT_LIST),
                                    }).map((_, p) => (
                                        <PaginationItem className="cursor-pointer" key={p}>
                                            <PaginationLink
                                                isActive={p + 1 === page}
                                                onClick={() => setPage(p + 1)}
                                            >
                                                {p + 1}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}
                                    <PaginationItem>
                                        <PaginationNext
                                            className={
                                                page ===
                                                    Math.ceil(search?.data?.total! / LIMIT_PAE_PRODUCT_LIST)
                                                    ? "pointer-events-none opacity-50"
                                                    : "cursor-pointer"
                                            }
                                            onClick={() => setPage(page + 1)}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </div>
            </div>
        </LayoutWapper >
    )
}
