import {createElement, ReactPortal} from 'react';
import {createPortal} from 'react-dom';
import {ComponentType, Promise} from '@ag-grid-community/core';
import {AgGridReact} from "./agGridReact";
import {ReactComponent} from './reactComponent';
import generateNewKey from './keyGenerator';
import {renderToStaticMarkup} from 'react-dom/server';

export class LegacyReactComponent extends ReactComponent {
    static SLOW_RENDERERING_THRESHOLD = 3;

    private componentType: ComponentType;
    private staticMarkup: HTMLElement | null | string = null;
    private staticRenderTime: number = 0;

    constructor(reactComponent: any, parentComponent: AgGridReact, componentType: ComponentType) {
        super(reactComponent, parentComponent);

        this.componentType = componentType;
    }

    public init(params: any): Promise<void> {
        this.eParentElement = this.createParentElement(params);
        this.renderStaticMarkup(params);

        return new Promise<void>(resolve => this.createReactComponent(params, resolve));
    }

    private createReactComponent(params: any, resolve: (value: any) => void) {
        // regular components (ie not functional)
        if (!this.isStatelessComponent()) {
            // grab hold of the actual instance created
            params.ref = (element: any) => {
                this.componentInstance = element;
                this.addParentContainerStyleAndClasses();

                this.removeStaticMarkup();
            };
        }

        const reactComponent = createElement(this.reactComponent, params);
        const portal: ReactPortal = createPortal(
            reactComponent,
            this.eParentElement as any,
            generateNewKey() // fixed deltaRowModeRefreshCompRenderer
        );

        this.portal = portal;
        this.parentComponent.mountReactPortal(portal, this, (value: any) => {
            resolve(value);

            // functional/stateless components have a slightly different lifecycle (no refs) so we'll clean them up
            // here
            if (this.isStatelessComponent()) {
                if (this.isSlowRenderer()) {
                    this.removeStaticMarkup()
                }
                setTimeout(() => {
                    this.removeStaticMarkup()
                });
            }
        });
    }

    private isSlowRenderer() {
        return this.staticRenderTime >= LegacyReactComponent.SLOW_RENDERERING_THRESHOLD;
    }

    public isNullRender(): boolean {
        return this.staticMarkup === '';
    }

    /*
     * Attempt to render the component as static markup if possible
     * What this does is eliminate any visible flicker for the user in the scenario where a component is destroyed and
     * recreated with exactly the same data (ie with force refresh)
     * Note: Some use cases will throw an error (ie when using Context) so if an error occurs just ignore it any move on
     */
    private renderStaticMarkup(params: any) {
        if (this.parentComponent.isDisableStaticMarkup() || (this.componentType.isCellRenderer && !this.componentType.isCellRenderer())) {
            return;
        }

        const originalConsoleError = console.error;
        const reactComponent = createElement(this.reactComponent, params);

        try {
            // if a user is doing anything that uses useLayoutEffect (like material ui) then it will throw and we
            // can't do anything to stop it; this is just a warning and has no effect on anything so just suppress it
            // for this single operation
            console.error = () => {
            };

            const start = Date.now();
            const staticMarkup = renderToStaticMarkup(reactComponent);
            this.staticRenderTime = Date.now() - start;

            console.error = originalConsoleError;

            // if the render method returns null the result will be an empty string
            if (staticMarkup === '') {
                this.staticMarkup = staticMarkup;
            } else {
                if (staticMarkup) {
                    // we wrap the content as if there is "trailing" text etc it's not easy to safely remove
                    // the same is true for memoized renderers, renderers that that return simple strings or NaN etc
                    this.staticMarkup = document.createElement('span');
                    this.staticMarkup.innerHTML = staticMarkup;
                    this.eParentElement.appendChild(this.staticMarkup);
                }
            }
        } catch (e) {
            // we tried - this can happen with certain (rare) edge cases
        } finally {
            console.error = originalConsoleError;
        }
    }

    private removeStaticMarkup() {
        if (this.parentComponent.isDisableStaticMarkup() || !this.componentType.isCellRenderer()) {
            return;
        }

        if (this.staticMarkup) {
            if ((this.staticMarkup as HTMLElement).remove) {
                // everyone else in the world
                (this.staticMarkup as HTMLElement).remove();
                this.staticMarkup = null;
            } else if (this.eParentElement.removeChild) {
                // ie11...
                this.eParentElement.removeChild(this.staticMarkup as any);
                this.staticMarkup = null;
            }
        }
    }

    rendered(): boolean {
        return this.isNullRender() ||
            !!this.staticMarkup || (this.isStatelessComponent() && this.statelessComponentRendered()) ||
            !!(!this.isStatelessComponent() && this.getFrameworkComponentInstance());
    }
}
