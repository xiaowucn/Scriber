SHELL := /bin/bash

UID := $(shell id -u)
GID := $(shell id -g)
PWD := $(shell pwd)
PREFIX := build_task_to_BUILD_
IMAGE := registry.cheftin.cn/p/node22

target=szse szse_ipo sse csc ecitic citics_tg ccxi ccxi_contract hkex stencil ht csc_octopus cgs \
	gffund chinaamc stronghold cmfchina cms dist chinaamc_yx nafmii zts

.PHONY : clean all exec_in_container build_tasks install_modules
.DEFAULT_GOAL := all

ifneq ($(BUILD_CACHE_DIR),)
CACHE_DIR := $(BUILD_CACHE_DIR)/$(GO_PIPELINE_NAME)
else ifneq ($(GO_PIPELINE_NAME),)
CACHE_DIR := $(PWD)/../../$(GO_PIPELINE_NAME)_cache
else
CACHE_DIR := $(PWD)/../cache/front_scriber
endif

DOCKER_RUN_ARGS := --pull always --rm --init -v $(PWD):/opt/src/ \
		-v $(CACHE_DIR)/node_modules:/opt/build/node_modules \
		-v $(CACHE_DIR)/yarn_cache:/tmp/.cache \
		-u $(UID):$(GID) $(IMAGE)

# 将不带前缀的 target 刷成 build_task_to_BUILD_XXX
define add_build_target_prefix
$(if $(filter $(PREFIX)%,$(1)),$(subst $(PREFIX),,$(1)),$(1))
endef

# 生成 build_task_to_BUILD_XXX 和 XXX 的 target
define make_build_target
.PHONY: $(PREFIX)$(1)
$(PREFIX)$(1):
	docker run --pull always --rm -e BUILD_TARGET=$(1) $(DOCKER_RUN_ARGS) bash -ec "cd /opt/src && make exec_in_container"

.PHONY: $(1)
$(1):
	$(MAKE) $(PREFIX)$(call add_build_target_prefix,$(t))
endef

$(foreach t,$(target),$(eval $(call make_build_target,$(call add_build_target_prefix,$(t)))))

all:
	$(MAKE) clean
	$(MAKE) install_modules
	$(MAKE) build_tasks

install_modules:
	mkdir -p $(CACHE_DIR)/node_modules $(CACHE_DIR)/yarn_cache $(CACHE_DIR)/npm_cache
	docker run $(DOCKER_RUN_ARGS) bash -ec "rsync -rlD --exclude=/dist* /opt/src/ /opt/build/ && cd /opt/build && yarn install"

exec_in_container:
	rsync -rlD --exclude=/dist*  /opt/src/ /opt/build/ && \
	cd /opt/build && bash ci/build.sh &&\
	rsync -a $(BUILD_DIR)/dist* $(SRC_DIR)

build_tasks: $(foreach t,$(target),$(call add_build_target_prefix,$(t)))

clean:
	-rm -rf dist*

.PHONY: list
list:
	@LC_ALL=C $(MAKE) -pRrq -f $(firstword $(MAKEFILE_LIST)) : 2>/dev/null | awk -v RS= -F: '/(^|\n)# Files(\n|$$)/,/(^|\n)# Finished Make data base/ {if ($$1 !~ "^[#.]") {print $$1}}' | sort | grep -E -v -e '^[^[:alnum:]]' -e '^$@$$'
