<template>

    <SkeletonLoader :count=5 :padding=15 :distance=8>
        <SkeletonRow :flex=0>
            <Skeleton :width=45 :height=45 :radius=50 />
        </SkeletonRow>
        <SkeletonRow column :flex=1>
            <Skeleton :margin="[0, 0, 13, 20]" :height=13 />
            <Skeleton :margin="[0, 0, 0, 20]" :height=13 />
        </SkeletonRow>
    </SkeletonLoader>

</template>