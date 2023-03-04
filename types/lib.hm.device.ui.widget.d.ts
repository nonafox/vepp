declare namespace HmWearableProgram {
  namespace DeviceSide {
    namespace HmUI {
      type extendsBase<
        T extends { attrs?: any; on?: any; styles?: any },
        B extends { attrs?: any; on?: any; styles?: any },
      > = {
        attrs?: Id<Partial<T['attrs'] & B['attrs']>>
        on?: Id<Partial<T['on'] & B['on']>>
        styles?: Id<Partial<T['styles'] & B['styles']>>
      }

      interface IHmUIWidgetOptions {
        [k: string]: any
        attrs?: {
          id?: string
          dataset?: string
          [k: string]: any
        }
        on?: {
          click_up?: IHmUIEventListener
          click_down?: IHmUIEventListener
          move_in?: IHmUIEventListener
          move_out?: IHmUIEventListener
          move?: IHmUIEventListener
        }
        styles?: {
          x?: number
          y?: number
          w?: number
          h?: number
          [k: string]: any
        }
      }
      interface IHmUIWidgetBasicOptions {
        x: number
        y: number
        w: number
        h: number
      }
      // group
      type GroupWidgetOptions = extendsBase<
        {
          attrs?: {
            text: string
          }
          styles?: {
            x: number
          }
        },
        IHmUIWidgetOptions
      >

      interface GroupWidget extends IHmUIWidget, IHmUIFunction, Omit<IWidgetFactory, 'group'> {
        // pass
        name: string
      }
      // checkboxGroup widget
      type CheckBoxGroupWidgetOptions = extendsBase<
        {
          attrs: {
            select_src: string
            unselect_src: string
          }
          styles: {
            x: number
            y: number
            w: number
            h: number
          }
          on: {
            check_func?: IHmUIEventListener
          }
        },
        IHmUIWidgetOptions
      >

      interface CheckBoxGroupWidget
        extends IHmUIWidget,
          IHmUIFunction,
          Omit<IWidgetFactory, 'group'>,
          Omit<IWidgetFactory, 'checkboxGroup'> {
        // pass
        name: string
      }

      // checkbox widget
      type CheckBoxWidgetOptions = extendsBase<
        {
          styles: {
            x: number
            y: number
            w: number
            h: number
          }
        },
        IHmUIWidgetOptions
      >

      interface CheckBoxWidget extends IHmUIWidget {
        name: string
      }

      // radioGroup widget
      type RadioGroupWidgetOptions = CheckBoxGroupWidgetOptions

      interface RadioGroupWidget
        extends IHmUIWidget,
          IHmUIFunction,
          Omit<IWidgetFactory, 'group'>,
          Omit<IWidgetFactory, 'radioGroup'> {
        // pass
        name: string
      }

      // radio widget
      type RadioWidgetOptions = CheckBoxWidgetOptions

      interface RadioWidget extends IHmUIWidget {
        name: string
      }

      // text widget
      type TextWidgetOptions = extendsBase<
        {
          attrs?: {
            /**
             * 显示内容
             *
             * @type {string}
             */
            text?: string
          }
          styles?: {
            /**
             * 文本颜色, 16 进制数
             *
             * @type {number}
             */
            color?: number

            /**
             * 水平对齐方式 LEFT RIGHT CENTER
             *
             * @type {number}
             */
            align_v?: number

            /**
             * 垂直对齐方式 TOP BOTTOM CENTER
             *
             * @type {number}
             */
            align_h?: number

            text_size?: number
          }
        },
        IHmUIWidgetOptions
      >

      interface TextWidget extends IHmUIWidget {
        // pass
        name: string
      }

      // image widget
      type ImageWidgetOptions = extendsBase<
        {
          attrs?: {
            /**
             * 图片路径
             *
             * @type {string}
             */
            src?: string
          }

          styles?: {
            /**
             * 图片显示x点 对于控件相对坐标
             *
             * @type {number}
             */
            pos_x?: number

            /**
             * 图片显示y点 对于控件相对坐标
             *
             * @type {number}
             */
            pos_y?: number

            /**
             * 图片旋转角度
             *
             * @type {number}
             */
            angle?: number

            /**
             * 图片旋转中心 x 坐标
             *
             * @type {number}
             */
            center_x?: number

            /**
             * 图片旋转中心 y 坐标
             *
             * @type {number}
             */
            center_y?: number
          }
        },
        IHmUIWidgetOptions
      >

      interface ImageWidget extends IHmUIWidget {
        // pass
        name: string
      }

      // arc widget
      type ArcWidgetOptions = extendsBase<
        {
          styles?: {
            /**
             * 圆弧开始角度
             *
             * @type {number}
             */
            start_angle?: number

            /**
             * 圆弧结束角度
             *
             * @type {number}
             */
            end_angle?: number

            /**
             * 圆弧线宽
             *
             * @type {number}
             */
            line_width?: number
          }
        },
        IHmUIWidgetOptions
      >

      interface ArcWidget extends IHmUIWidget {
        // pass
        name: string
      }

      type FillRectWidgetOptions = extendsBase<
        {
          attrs: {
            //
          }
          styles: {
            x: number
            y: number
            w: number
            h: number
            color: number
            radius: number
            angle: number
          }
        },
        IHmUIWidgetOptions
      >

      interface FillRectWidget extends IHmUIWidget {
        // pass
        name: string
      }

      // stroke widget
      type StrokeRectWidgetOptions = extendsBase<
        {
          attrs: {
            id: string
          }
          styles: {
            x: number
            y: number
            w: number
            h: number
            color: number
            radius: number
            line_width: number
            angle: number
          }
        },
        IHmUIWidgetOptions
      >

      interface StrokeRectWidget extends IHmUIWidget {
        // pass
        name: string
      }

      type ImgTextWidgetOptions = extendsBase<
        {
          attrs: {
            text: string
          }
          styles: {
            x: number
          }
        },
        IHmUIWidgetOptions
      >

      interface ImgTextWidget extends IHmUIWidget {
        // pass
        name: string
      }

      type ArcProgressWidgetOptions = extendsBase<
        {
          attrs: {
            text: string
          }
          styles: {
            x: number
          }
        },
        IHmUIWidgetOptions
      >

      interface ArcProgressWidget extends IHmUIWidget {
        // pass
        name: string
      }

      type LineProgressWidgetOptions = extendsBase<
        {
          attrs: {
            text: string
          }
          styles: {
            x: number
          }
        },
        IHmUIWidgetOptions
      >

      interface LineProgressWidget extends IHmUIWidget {
        // pass
        name: string
      }

      type ImgProgressWidgetOptions = extendsBase<
        {
          attrs: {
            text: string
          }
          styles: {
            x: number
          }
        },
        IHmUIWidgetOptions
      >

      interface ImgProgressWidget extends IHmUIWidget {
        // pass
        name: string
      }
      // img progress level
      type ImgProgressLevelWidgetOptions = extendsBase<
        {
          attrs: {
            image_array: Array<string>
            image_length: number
            level: number
          }
          styles: {
            x: number
            y: number
            w?: number
            h?: number
          }
        },
        IHmUIWidgetOptions
      >

      interface ImgProgressLevelWidget extends IHmUIWidget {
        // pass
        name: string
      }

      // img progress level
      type ImgAnimationWidgetOptions = extendsBase<
        {
          attrs: {
            anim_path: string
            anim_prefix: string
            anim_ext: string
            anim_fps: number
            anim_size: number
            repeat_count: number
            anim_status: number
          }
          styles: {
            x: number
            y: number
          }
          on: {
            anim_complete_call: IHmUIEventListener
          }
        },
        IHmUIWidgetOptions
      >

      interface ImgAnimationWidget extends IHmUIWidget {
        // pass
        name: string
      }
      type ButtonWidgetOptions = extendsBase<
        {
          attrs: {
            text: string
          }
          styles: {
            x: number
          }
        },
        IHmUIWidgetOptions
      >

      interface ButtonWidget extends IHmUIWidget {
        // pass
        name: string
      }

      type CircleWidgetOptions = extendsBase<
        {
          attrs: {
            text: string
          }
          styles: {
            x: number
          }
        },
        IHmUIWidgetOptions
      >

      interface CircleWidget extends IHmUIWidget {
        // pass
        name: string
      }

      type DialogWidgetOptions = extendsBase<
        {
          attrs: {
            text: string
          }
          styles: {
            x: number
          }
        },
        IHmUIWidgetOptions
      >

      interface DialogWidget extends IHmUIWidget {
        // pass
        name: string
      }

      // scrollList
      type ScrollTextItemOptions = {
        color?: number
        text_size?: number
        key: string
      } & IHmUIWidgetBasicOptions

      type ScrollImageItemOptions = { key: string } & IHmUIWidgetBasicOptions

      type ScrollListOptions = extendsBase<
        {
          attrs: {
            text_view: Array<ScrollTextItemOptions>
            text_view_count: number

            image_view: Array<string>
            image_view_count: number

            data_array: Array<ScrollImageItemOptions>
            data_count: number
            item_height: number
            item_space?: number
            item_bg_color: number
            item_bg_radius: number
          }
          styles: IHmUIWidgetBasicOptions
          on?: {
            item_click_func?: IHmUIEventListener
          }
        },
        IHmUIWidgetOptions
      >
      interface ScrollListWidget extends IHmUIWidget {
        // pass
        name: string
      }

      // slideswitch
      type SlideSwitchOptions = extendsBase<
        {
          attrs: {
            checked?: boolean
            select_bg: string
            unselect_bg: string
            slide_src: string
          }
          styles: IHmUIWidgetBasicOptions & {
            slide_select_x: number
            slide_un_select_x: number

            slide_y?: number
          }
          on?: {
            checked_change_func?: IHmUIEventListener
          }
        },
        IHmUIWidgetOptions
      >

      interface SlideSwitchWidget extends IHmUIWidget {
        // pass
        name: string
      }

      //cycleimagelist
      type CycleImageListOptions = extendsBase<
        {
          attrs: {
            data_array: Array<string>
            data_size: number

            item_bg_color?: number
            item_height: number
          }
          styles: IHmUIWidgetBasicOptions
          on?: {
            item_click_func?: IHmUIEventListener
          }
        },
        IHmUIWidgetOptions
      >

      interface CycleImageListWidget extends IHmUIWidget {
        // pass
        name: string
      }

      //cyclelist
      type CycleListImageItemOptions = {
        src?: string
        text: string
      }

      type CycleListOptions = extendsBase<
        {
          attrs: {
            data_array: Array<CycleListImageItemOptions>
            data_size: number

            item_bg_color: number
            item_height: number
            item_text_color: number
            item_text_size: number
            item_text_x: number
            item_text_y: number
            item_image_x?: number
            item_image_y?: number
          }
          styles: IHmUIWidgetBasicOptions
          on?: {
            item_click_func?: IHmUIEventListener
          }
        },
        IHmUIWidgetOptions
      >

      interface CycleListWidget extends IHmUIWidget {
        // pass
        name: string
      }

      // pointer
      type PointerOptions = extendsBase<
        {
          attrs: {
            angle?: number
            src: string
          }
          styles: {
            x: number
            y: number
            center_x: number
            center_y: number
          }
        },
        IHmUIWidgetOptions
      >

      interface PointerWidget extends IHmUIWidget {
        // pass
        name: string
      }

      // textimg
      type TextImgOptions = extendsBase<
        {
          attrs: {
            font_array: Array<string>
            type?: number
            text?: number
            unit_src?: string
            unit_en?: string
            unit_tc?: string
            imperial_unit_sc?: string
            imperial_unit_en?: string
            imperial_unit_tc?: string
            negative_image?: string
            dont_path?: string
          }
          styles: {
            x: number
            y: number
            h_space?: number
            align_h?: number
          }
        },
        IHmUIWidgetOptions
      >

      interface TextImgWidget extends IHmUIWidget {
        // pass
        name: string
      }

      interface HmUITagWidgetMap {
        // 控件
        group: [GroupWidgetOptions, GroupWidget]
        checkboxGroup: [CheckBoxGroupWidgetOptions, CheckBoxGroupWidget]
        checkbox: [CheckBoxWidgetOptions, CheckBoxWidget]
        radioGroup: [RadioGroupWidgetOptions, RadioGroupWidget]
        radio: [RadioWidgetOptions, RadioWidget]

        text: [TextWidgetOptions, TextWidget]
        image: [ImageWidgetOptions, ImageWidget]
        button: [ButtonWidgetOptions, ButtonWidget]

        imgText: [ImageWidgetOptions, ImgTextWidget]
        arcProgress: [ArcProgressWidgetOptions, ArcProgressWidget]
        imgProgress: [ImgProgressWidgetOptions, ImgProgressWidget]
        imgProgressLevel: [ImgProgressLevelWidgetOptions, ImgProgressLevelWidget]
        imgAnimation: [ImgAnimationWidgetOptions, ImgAnimationWidget]

        scrollList: [ScrollListOptions, ScrollListWidget]
        slideSwitch: [SlideSwitchOptions, SlideSwitchWidget]
        cycleImageList: [CycleImageListOptions, CycleImageListWidget]
        cycleList: [CycleListOptions, CycleListWidget]
        pointer: [PointerOptions, PointerWidget]
        textImg: [TextImgOptions, TextImgWidget]

        // 几何图形
        strokeRect: [StrokeRectWidgetOptions, StrokeRectWidget]
        arc: [ArcWidgetOptions, ArcWidget]
        fillRect: [FillRectWidgetOptions, FillRectWidget]
        circle: [CircleWidgetOptions, CircleWidget]
        dialog: [DialogWidgetOptions, DialogWidget]
      }

      type IWidgetFactory = {
        [k in keyof HmUITagWidgetMap]: (opts: HmUITagWidgetMap[k][0]) => HmUITagWidgetMap[k][1]
      }
    }
  }
}

declare let h: HmWearableProgram.DeviceSide.HmUI.IWidgetFactory
